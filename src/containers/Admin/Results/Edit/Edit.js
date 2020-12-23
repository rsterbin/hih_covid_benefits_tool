import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

import EditForm from '../../../../components/Admin/Forms/EditResult/EditResult';

class AdminResultsEdit extends Component {

    state = {
        processing: false,
        processing_error: null
    };

    refresh = () => {
        this.fetchScenario();
    };

    submit = (form) => {
        this.props.saveScenario(this.getCode(), this.getId(), form);
    };

    componentDidMount() {
        Logger.setComponent('Admin/Results/Edit');
        this.fetchScenario();
    }

    fetchScenario() {
        this.props.fetchScenario(this.getCode(), this.getId());
    }

    getCode() {
        return this.props.match.params.benefit;
    }

    getId() {
        return this.props.match.params.id;
    }

    render() {
        Logger.setComponent('Admin/Results/Edit');
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];

        if (this.props.info.loaded) {
            title += this.props.info.benefit.abbreviation + ': Edit Scenario';
            crumbs.push(this.props.info.benefit.abbreviation);
            crumbs.push('Scenario');

            const prefill = {
                enabled: this.props.info.scenario.enabled,
                en_result: this.props.info.scenario.en_result,
                en_expanded: this.props.info.scenario.en_expanded
            };

            body = (
                <EditForm
                    saved={this.state.saved ? 'The scenario response has been saved' : null}
                    scenario={this.props.info.scenario}
                    submitAction={this.submit}
                    prefill={prefill} />
            );

        } else {
            title += 'Edit Scenario';
            crumbs.push('Scenario');

            body = (
                <Aux>
                    {this.props.info.error ?
                        <Message type="error" text={this.props.info.error} tryagain={this.refresh} />
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
        info: state.admin.results.info
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchScenario: (benefit, id) => dispatch(actions.loadScenario(benefit, id)),
        saveScenario: (benefit, id, form) => dispatch(actions.saveScenario(benefit, id, form))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminResultsEdit));
