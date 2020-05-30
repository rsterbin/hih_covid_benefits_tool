import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import SelectFilters from '../../../../components/UI/SelectFilters/SelectFilters';
import Table from '../../../../components/UI/Table/Table';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminResultsFilter extends Component {

    state = {
        loaded: false,
        benefit: null,
        conditions: null,
        scenarios: null,
        error: null,
        filters: {}
    };

    cols = [
        { key: 'help', title: 'Scenario' },
        { key: 'enabled', title: 'Eligible?' },
        { key: 'en_result', title: 'Response (Short)' }
    ];

    clickable = {
        help: (row) => { this.editScenario(row); }
    };

    editScenario = (row) => {
        this.props.history.push('/admin/results/' + row.code + '/edit' + row.id);
    };

    filterResponses = (e) => {
        const condition = e.target.getAttribute('name');
        const letter = e.target.options[e.target.selectedIndex].value;
        this.setState((prevState) => {
            let newFilters = {};
            for (const key in prevState.filters) {
                if (key === condition) {
                    if (letter) {
                        newFilters[key] = letter;
                    } else {
                        newFilters[key] = null;
                    }
                } else if (prevState.filters[key]) {
                    newFilters[key] = prevState.filters[key];
                } else {
                    newFilters[key] = null;
                }
            }
            return { filters: newFilters };
        });
    };

    componentDidMount() {
        this.fetchBenefit(this.props.match.params.benefit);
    }

    filter() {
        console.log(this.state.filters);
        return this.state.scenarios.filter(scenario => {
            for (const key in this.state.filters) {
                if (this.state.filters[key] !== null) {
                    if (scenario.condition_map[key] !== this.state.filters[key]) {
                        return false;
                    } else {
                    }
                }
            }
            return true;
        });
    }

    fetchBenefit() {
        this.setState({
            loaded: false,
            benefit: null,
            conditions: null,
            scenarios: null,
            error: null,
            filters: null
        });
        const data = { token: this.props.token };
        Api.getScenarios(this.props.match.params.benefit, data)
            .then((response) => {
                if (!response.data.benefit) {
                    this.setState({ error: 'That benefit is unknown' });
                } else {
                    const benefit = response.data.benefit;
                    const conditions = response.data.conditions ? response.data.conditions : [];
                    const scenarios = response.data.scenarios ? response.data.scenarios : [];
                    const filters = {};
                    for (const c of conditions) {
                        filters[c.key_name] = null;
                    }
                    console.log(filters);
                    this.setState({
                        loaded: true,
                        benefit: benefit,
                        conditions: conditions,
                        scenarios: scenarios,
                        filters: filters
                    });
                }
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch benefit scenarios', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch benefit scenarios' });
            });
    }


    render() {
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];
        if (this.state.loaded) {
            title += this.state.benefit.abbreviation + ': Filter Responses';
            crumbs.push(this.state.benefit.abbreviation);
            crumbs.push('Filter');
            const selectProps = this.state.conditions.map(condition => {
                const options = condition.options.map(option => {
                    return {
                        value: option.letter,
                        text: option.answer,
                    };
                });
                return {
                    label: condition.name,
                    name: condition.key_name,
                    options: options
                };
            });
            const selects = (
                <SelectFilters
                    selects={selectProps}
                    empty="any"
                    changed={this.filterResponses} />
            );

            const rows = this.filter().map(scenario => {
                let i = 0;
                const lines = scenario.help.split(/\n/).map(line => {
                    ++i;
                    return <p key={i} className="LineBreak">{line}</p>
                });
                return {
                    help: lines,
                    enabled: scenario.enabled ? 'Yes' : 'No',
                    en_result: scenario.en_result
                };
            });

            body = (
                <Aux>
                    {selects}
                    <Table
                        rows={rows}
                        cols={this.cols}
                        clickable={this.clickable} />
                </Aux>
            );
        } else {
            title += 'Filter Benefit Responses';
            crumbs.push('Filter');
            body = (
                <Aux>
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );
        }
        return (
            <AdminPage title={title} breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminResultsFilter);
