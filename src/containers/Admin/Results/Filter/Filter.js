import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import SelectFilters from '../../../../components/UI/SelectFilters/SelectFilters';
import CompareTable from '../../../../components/Admin/CompareTable/CompareTable';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';
import Markdown from '../../../../utils/Markdown';

class AdminResultsFilter extends Component {

    state = {
        loaded: false,
        benefit: null,
        conditions: null,
        scenarios: null,
        error: null,
        filters: {},
        layout: 'list'
    };

    list_cols = [
        { key: 'help', title: 'Scenario' },
        { key: 'enabled', title: 'Eligible?' },
        { key: 'result', title: 'Response' }
    ];

    list_snip = {
        result: 120
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

    setLayout = (newLayout) => {
        this.setState({ layout: newLayout });
    };

    refresh = () => {
        this.fetchBenefit();
    };

    componentDidMount() {
        this.fetchBenefit();
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

    helpToElem(help) {
        const markup = help.split(/\n/).join('<br />\n');
        return <p dangerouslySetInnerHTML={{__html: markup}}></p>
    }

    markdownToElem(markdown) {
        const markup = Markdown.render(markdown || '');
        return <div dangerouslySetInnerHTML={{__html: markup}}></div>
    }

    getEditLink(id) {
        return '/admin/results/' + this.state.benefit.code + '/edit/' + id;
    }

    filter() {
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

    render() {
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];
        if (this.state.loaded) {
            title += this.state.benefit.abbreviation + ': Filter Responses';
            crumbs.push(this.state.benefit.abbreviation);
            crumbs.push('Filter');

            // Filtering
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

            // Table
            let rows = [];
            let cols = [];
            let snip = {};
            if (this.state.layout === 'compare') {
                cols = this.filter().map(scenario => {
                    return {
                        key: scenario.lang_key_result,
                        title: this.helpToElem(scenario.help)
                    };
                });
                let enabled_row = {};
                let short_row = {};
                let long_row = {};
                let edit_row = {};
                for (const scenario of this.filter()) {
                    const code = scenario.lang_key_result;
                    let eligibleFlag = null;
                    if (scenario.enabled) {
                        eligibleFlag = (
                            <span className="EligibleFlag GenericSuccess">
                                <i class="fas fa-check-square"></i>
                                &nbsp;
                                Eligible
                            </span>
                        );
                    } else {
                        eligibleFlag = (
                            <span className="EligibleFlag GenericError">
                                <i class="fas fa-times"></i>
                                &nbsp;
                                Not Eligible
                            </span>
                        );
                    }
                    enabled_row[code] = eligibleFlag;
                    short_row[code] = this.markdownToElem(scenario.en_result);
                    long_row[code] = this.markdownToElem(scenario.en_expanded);
                    edit_row[code] = (
                        <Link to={this.getEditLink(scenario.id)}>
                            <i className="fas fa-pencil-alt"></i> Edit
                        </Link>
                    );
                }
                rows.push(enabled_row);
                rows.push(short_row);
                rows.push(long_row);
                rows.push(edit_row);
            } else {
                rows = this.filter().map(scenario => {
                    const link = (
                        <Link to={this.getEditLink(scenario.id)}>
                            {this.helpToElem(scenario.help)}
                        </Link>
                    );
                    let combined = '';
                    if (scenario.en_result || scenario.en_expanded) {
                        combined += scenario.en_result || '';
                        combined += "\n\n---\n\n";
                        combined += scenario.en_expanded || '';
                    }
                    return {
                        id: scenario.id,
                        help: link,
                        enabled: scenario.enabled ? 'Yes' : 'No',
                        result: combined
                    };
                });
                cols = this.list_cols;
                snip = this.list_snip;
            }

            body = (
                <Aux>
                    {selects}
                    <CompareTable
                        current={this.state.layout}
                        changed={this.setLayout}
                        rows={rows}
                        cols={cols}
                        other={{snip: snip}} />
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
