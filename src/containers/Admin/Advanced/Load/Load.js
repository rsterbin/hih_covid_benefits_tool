import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import DeployData from '../../../../data/deployment.json';

class AdminAdvancedLoad extends Component {

    state = {
        loaded: false,
        processing: false,
        process_data: null,
        error: null,
    };

    initDeploys = () => {
        this.setState({
            processing: true,
            process_data: null,
            error: null
        });
        const data = {
            token: this.props.token,
            id: this.state.deployment.deployment_id
        };
        Api.revertAdmin(data)
            .then(response => {
                this.setState({
                    processing: false,
                    process_data: JSON.stringify(response.data),
                    error: null
                });
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = Api.parseAxiosError(error);
                Logger.alert('Could not initialize the language deploy', { api_error: parsed });
                this.setState({
                    processing: false,
                    error: '[' + parsed.code + '] ' + parsed.message
                });
            });
    }

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/Load');
        const id = this.getId();
        if (!id) {
            this.setState({ loaded: true, deployment: DeployData });
        } else {
            this.fetchDeployment();
        }
    }

    fetchDeployment() {
        this.setState({ loaded: false, error: null });
        const data = { token: this.props.token, id: this.getId() };
        Api.getDeploymentInfo(data)
            .then((response) => {
                this.setState({
                    loaded: true,
                    deployment: response.data.deployment
                });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch deployment info', { api_error: Api.parseAxiosError(error), key: this.getId() });
                this.setState({ error: 'Could not fetch deployment info' });
            });
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
        if (!this.state.loaded) {
            body = (
                <Aux>
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );
        } else {
            let functionTitle = 'Replace the admin database with version ' + this.state.deployment.version_num;
            let dt = DateTime.fromISO(this.state.deployment.date_deployed);
            let formatted = dt.toFormat('LLL dd');
            let functionExplainer = 'This will destroy any changes that have been made in the admin since ' + formatted;
            body = (
                <FunctionBox
                    working={this.state.processing}
                    emptyText="Click Go to re-intitalize the translations..."
                    results={this.state.process_data}
                    title={functionTitle}
                    explainer={functionExplainer}
                    clicked={this.initDeploys}
                    buttonText="Go"
                    error={this.state.error}
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

export default withRouter(AdminAdvancedLoad);
