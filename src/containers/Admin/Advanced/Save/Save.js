import React, { Component } from 'react';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import './Save.css';

class AdminAdvancedSave extends Component {

    state = {
        processing: false,
        process_data: null,
        error: null,
        download_info: null
    };

    deploy = () => {
        this.setState({
            processing: true,
            process_data: null,
            error: null
        });
        const data = {
            token: this.props.token
        };
        Api.deployAdmin(data)
            .then(response => {
                this.setState({
                    processing: false,
                    process_data: JSON.stringify(response.data),
                    download_info: response.data,
                    error: null
                });
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = Api.parseAxiosError(error);
                Logger.alert('Could not deploy recent changes', { api_error: parsed });
                this.setState({
                    processing: false,
                    error: '[' + parsed.code + '] ' + parsed.message
                });
            });
    }

    render() {
        let successBox = null;
        if (this.state.download_info) {
            const vnum = this.state.download_info.version;
            const hash = this.state.download_info.hash;
            const url = Api.getDownloadUrl(vnum, hash, this.props.token);
            const fname = 'hnct-' + vnum + '.zip';
            const downloadLink = (
                <a className="DownloadDeploy" download={fname} href={url}>
                    <i className="fas fa-download" title="download"></i>
                </a>
            );
            successBox = <Message type="success"
                text="Download the deploy here:"
                custom_button={downloadLink} />;
        }

        return (
            <AdminPage
                title="Advanced Functions: Save Deploy"
                breadcrumbs={['Admin', 'Advanced', 'Save Deploy']}
                advanced={true}>
                <DeployMessage />
                <FunctionBox
                    working={this.state.processing}
                    emptyText="Click Go to deploy all changes..."
                    results={this.state.process_data}
                    title="Wrap all changes from the admin into a new deployment"
                    explainer="This will create a zip file you can download containing the new versions of the data files to be commited and deployed"
                    clicked={this.deploy}
                    buttonText="Go"
                    error={this.state.error}
                    successBox={successBox}
                    />
            </AdminPage>
        );
    }
}

export default AdminAdvancedSave;
