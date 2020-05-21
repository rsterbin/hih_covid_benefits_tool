import React, { Component } from 'react';

import AdminPage from '../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../components/Admin/FunctionBox/FunctionBox';
import Message from '../../../components/UI/Message/Message';
import Api from '../../../storage/Api';
import Logger from '../../../utils/Logger';

import EnglishData from '../../../data/lang/en.json';
import KeysData from '../../../data/lang/keys.json';

import './Advanced.css';

class AdminAdvanced extends Component {

    state = {
        init_processing: false,
        init_process_data: null,
        init_error: null,
        deploy_processing: false,
        deploy_process_data: null,
        deploy_error: null,
        download_info: null
    };

    initDeploys = () => {
        this.setState({
            init_processing: true,
            init_process_data: null,
            init_error: null
        });
        const data = {
            token: this.props.token,
            en: EnglishData,
            keys: KeysData
        };
        Api.initializeAdmin(data)
            .then(response => {
                this.setState({
                    init_processing: false,
                    init_process_data: JSON.stringify(response.data),
                    init_error: null
                });
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = Api.parseAxiosError(error);
                Logger.alert('Could not initialize the language deploy', { api_error: parsed });
                this.setState({
                    init_processing: false,
                    init_error: '[' + parsed.code + '] ' + parsed.message
                });
            });
    }

    deploy = () => {
        this.setState({
            deploy_processing: true,
            deploy_process_data: null,
            deploy_error: null
        });
        const data = {
            token: this.props.token
        };
        Api.deployAdmin(data)
            .then(response => {
                this.setState({
                    deploy_processing: false,
                    deploy_process_data: JSON.stringify(response.data),
                    download_info: response.data,
                    deploy_error: null
                }, () => {
                    console.log(response.data);
                    this.fetchDownload(response.data.version, response.data.hash);
                });
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = Api.parseAxiosError(error);
                Logger.alert('Could not deploy recent changes', { api_error: parsed });
                this.setState({
                    deploy_processing: false,
                    deploy_error: '[' + parsed.code + '] ' + parsed.message
                });
            });
    }

    fetchDownload(version, hash) {
        const url = Api.getDownloadUrl(version, hash, this.props.token);

        // Why not axios? Because as far as I can tell, it's not possible to set the encoding to null and pull a data stream
        var request = require('request').defaults({ encoding: null });
        request.get(url, (e, r, b) => { this.handleDownload(e, r, b); });
    };

    handleDownload(error, response, body) {
        if (!error && response.statusCode === 200) {
            const data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            const vnum = this.state.download_info.version;
            this.setState({
                download_link_data: data,
                download_link_filename: 'hnct-' + vnum + '.zip' });
        } else {
            this.setState({ deploy_error: error });
        }
    }

    render() {
        let initBox = (
            <FunctionBox
                working={this.state.init_processing}
                emptyText="Click Go to re-intitalize the translations..."
                results={this.state.init_process_data}
                title="Replace the admin database with the currently deployed version"
                explainer="This will destroy any changes that have been made in the admin since the last deploy"
                clicked={this.initDeploys}
                buttonText="Go"
                error={this.state.init_error}
                />
        );

        let successBox = null;
        if (this.state.download_link_filename) {
            console.log(this.state.download_link_filename);
            console.log(this.state.download_link_data);
            const downloadLink = (
                <a className="DownloadDeploy" download={this.state.download_link_filename}
                    href={this.state.download_link_data}>
                    <i className="fas fa-download" title="download"></i>
                </a>
            );
            successBox = <Message type="success"
                text="Download the deploy here:"
                custom_button={downloadLink} />;
        }
        let deployBox = (
            <FunctionBox
                working={this.state.deploy_processing}
                emptyText="Click Go to deploy all changes..."
                results={this.state.deploy_process_data}
                title="Wrap all changes from the admin into a new deployment"
                explainer="This will create a zip file you can download containing the new versions of the data files to be commited and deployed"
                clicked={this.deploy}
                buttonText="Go"
                error={this.state.deploy_error}
                successBox={successBox}
                />
        );

        return (
            <AdminPage
                title="Advanced Functions"
                breadcrumbs={['Admin', 'Advanced']}
                advanced={true}>
                {initBox}
                {deployBox}
            </AdminPage>
        );
    }
}

export default AdminAdvanced;
