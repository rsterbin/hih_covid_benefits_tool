import React, { Component } from 'react';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import EnglishData from '../../../../data/lang_en.json';
import KeysData from '../../../../data/lang_keys.json';
import BenefitsData from '../../../../data/benefits.json';
import ConditionsData from '../../../../data/conditions.json';
import ScenariosData from '../../../../data/scenarios.json';

class AdminAdvancedInit extends Component {

    state = {
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
            deploy: {
                lang_en: EnglishData,
                lang_keys: KeysData,
                benefits: BenefitsData,
                conditions: ConditionsData,
                scenarios: ScenariosData
            }
        };
        Api.initializeAdmin(data)
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

    render() {
        return (
            <AdminPage
                title="Advanced Functions: Initialize Deploy"
                breadcrumbs={['Admin', 'Advanced', 'Init Deploy']}
                advanced={true}>
                <DeployMessage />
                <FunctionBox
                    working={this.state.processing}
                    emptyText="Click Go to re-intitalize the translations..."
                    results={this.state.process_data}
                    title="Replace the admin database with the currently deployed version"
                    explainer="This will destroy any changes that have been made in the admin since the last deploy"
                    clicked={this.initDeploys}
                    buttonText="Go"
                    error={this.state.error}
                    />
            </AdminPage>
        );
    }
}

export default AdminAdvancedInit;
