import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import SelectFilters from '../../../../components/UI/SelectFilters/SelectFilters';
import CompareTable from '../../../../components/Admin/CompareTable/CompareTable';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Logger from '../../../../utils/Logger';
import Markdown from '../../../../utils/Markdown';
import * as actions from '../../../../storage/redux/actions/index';

class AdminResultsFilter extends Component {

    state = {
        layout: 'list'
    };

    filterResponses = (e) => {
        const condition = e.target.getAttribute('name');
        const letter = e.target.options[e.target.selectedIndex].value;
        this.props.changeFilter(condition, letter);
    };

    setLayout = (newLayout) => {
        this.setState({ layout: newLayout });
    };

    refresh = () => {
        this.props.fetchResults(this.getBenefitCode());
    };

    componentDidMount() {
        Logger.setComponent('Admin/Results/Filter');
        this.props.fetchResults(this.getBenefitCode());
    }

    getBenefitCode() {
        return this.props.match.params.benefit;
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
        return '/admin/results/' + this.props.benefit.code + '/edit/' + id;
    }

    filterScenarios() {
        return this.props.scenarios.filter(scenario => {
            for (const key in this.props.filters) {
                if (this.props.filters[key] !== null) {
                    if (scenario.condition_map[key] !== this.props.filters[key]) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    getListTable(scenarios) {
        const rows = scenarios.map(scenario => {
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

        const cols = [
            { key: 'help', title: 'Scenario' },
            { key: 'enabled', title: 'Eligible?' },
            { key: 'result', title: 'Response' }
        ];

        const snip = {
            result: 120
        };

        return (
            <CompareTable
                current={this.state.layout}
                changed={this.setLayout}
                rows={rows}
                cols={cols}
                other={{snip: snip}} />
        );
    }

    getCompareTable(scenarios) {
        const cols = scenarios.map(scenario => {
            return {
                key: scenario.lang_key_result,
                title: this.helpToElem(scenario.help)
            };
        });

        let enabled_row = {};
        let short_row = {};
        let long_row = {};
        let edit_row = {};
        for (const scenario of scenarios) {
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
        const rows = [ enabled_row, short_row, long_row, edit_row ];

        return (
            <CompareTable
                current={this.state.layout}
                changed={this.setLayout}
                rows={rows}
                cols={cols} />
        );
    }

    render() {
        Logger.setComponent('Admin/Results/Filter');
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];

        if (this.props.loaded) {
            title += this.props.benefit.abbreviation + ': Filter Responses';
            crumbs.push(this.props.benefit.abbreviation);
            crumbs.push('Filter');

            // Filtering
            const selectProps = this.props.conditions.map(condition => {
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
            let table = null;
            const scenarios = this.filterScenarios();
            if (this.state.layout === 'compare') {
                table = this.getCompareTable(scenarios);
            } else {
                table = this.getListTable(scenarios);
            }

            body = (
                <Aux>
                    {selects}
                    {table}
                </Aux>
            );

        } else {
            title += 'Filter Benefit Responses';
            crumbs.push('Filter');
            body = (
                <Aux>
                    {this.props.error ?
                        <Message type="error" text={this.props.error} tryagain={this.refresh} />
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

const mapStateToProps = state => {
    return {
        loaded: state.admin.results.filter.loaded,
        error: state.admin.results.filter.error,
        benefit: state.admin.results.filter.benefit,
        conditions: state.admin.results.filter.conditions,
        scenarios: state.admin.results.filter.scenarios,
        filters: state.admin.results.filter.filters
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchResults: (benefit) => dispatch(actions.loadResults(benefit)),
        changeFilter: (condtion, letter) => dispatch(actions.adminChangeResultsFilter(condtion, letter))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminResultsFilter));
