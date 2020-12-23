import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

class AdminAdvancedLoad extends Component {

    initDeploys = () => {
        this.props.overloadDeploy(this.getId());
    }

    refresh = () => {
        this.props.fetchDeploy(this.getId());
    };

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/Load');
        this.props.fetchDeploy(this.getId());
    }

    getId() {
        if (this.props.match.params.id) {
            return this.props.match.params.id;
        }
        return null;
    }

    render() {
        Logger.setComponent('Admin/Advanced/Load');
        let body = null;
        if (!this.props.fetch_loaded) {
            body = (
                <Aux>
                    {this.props.fetch_error ?
                        <Message type="error" text={this.props.fetch_error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );

        } else {
            let functionTitle = 'Replace the admin database with version ' + this.props.deployment.version_num;
            let dt = DateTime.fromISO(this.props.deployment.date_deployed);
            let formatted = dt.toFormat('LLL dd');
            let functionExplainer = 'This will destroy any changes that have been made in the admin since ' + formatted;
            body = (
                <FunctionBox
                    working={this.props.processing}
                    emptyText="Click Go to re-intitalize the translations..."
                    results={this.props.data}
                    title={functionTitle}
                    explainer={functionExplainer}
                    clicked={this.initDeploys}
                    buttonText="Go"
                    error={this.props.error}
                    />
            );
        }

        return (
            <AdminPage
                title="Advanced Functions: Load Deploy"
                breadcrumbs={['Admin', 'Advanced', 'Load Deploy']}
                advanced={true}>
                <DeployMessage />
                {body}
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        fetch_loaded: state.admin.deploys.fetch.loaded,
        fetch_error: state.admin.deploys.fetch.error,
        deployment: state.admin.deploys.fetch.data,
        processing: state.admin.deploys.overload.processing,
        error: state.admin.deploys.overload.error,
        data: state.admin.deploys.overload.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDeploy: (id) => dispatch(actions.loadDeployment(id)),
        overloadDeploy: (id) => dispatch(actions.overloadDeployment(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminAdvancedLoad));
