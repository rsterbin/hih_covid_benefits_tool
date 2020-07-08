import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import DeployData from '../../../../data/deployment.json';
import BenefitsData from '../../../../data/benefits.json';
import ConditionsData from '../../../../data/conditions.json';
import CtaData from '../../../../data/cta.json';
import LangEnData from '../../../../data/lang_en.json';
import LangKeysData from '../../../../data/lang_keys.json';
import ResourcesData from '../../../../data/resources.json';
import ScenariosData from '../../../../data/scenarios.json';

class AdminAdvancedReplace extends Component {

    state = {
        loaded: false,
        processing: false,
        process_data: null,
        error: null,
    };

    replaceDatabase = () => {
        this.setState({
            processing: true,
            process_data: null,
            error: null
        });
        const data = {
            token: this.props.token,
            deployment: DeployData,
            alldata: {
                benefits: BenefitsData,
                conditions: ConditionsData,
                cta: CtaData,
                lang_en: LangEnData,
                lang_keys: LangKeysData,
                resources: ResourcesData,
                scenarios: ScenariosData
            }
        };
        Api.replaceAdmin(data)
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
                Logger.alert('Could not replace the admin database', { api_error: parsed });
                this.setState({
                    processing: false,
                    error: '[' + parsed.code + '] ' + parsed.message
                });
            });
    }

    render() {
        return (
            <AdminPage
                title="Advanced Functions: Replace Database"
                breadcrumbs={['Admin', 'Advanced', 'Replace Database']}
                advanced={true}>
                <DeployMessage />
                <FunctionBox
                    working={this.state.processing}
                    emptyText="Click Go to replace the database..."
                    results={this.state.process_data}
                    title="Replace the admin database with the current files and create a new deployment"
                    explainer="This will destroy any changes that have been made in the admin that have not been saved to a deployment"
                    clicked={this.replaceDatabase}
                    buttonText="Go"
                    error={this.state.error}
                    />
            </AdminPage>
        );
    }
}

export default withRouter(AdminAdvancedReplace);
