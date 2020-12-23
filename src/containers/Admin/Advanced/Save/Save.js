import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

import './Save.css';

class AdminAdvancedSave extends Component {

    deploy = () => {
        this.props.saveDeploy();
    }

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/Save');
    }

    render() {
        Logger.setComponent('Admin/Advanced/Save');
        let successBox = null;
        if (this.props.download_info) {
            const vnum = this.props.download_info.version;
            const uuid = this.props.download_info.uuid;
            const url = Api.getDeployDownloadUrl(vnum, uuid, this.props.token);
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
                    working={this.props.processing}
                    emptyText="Click Go to deploy all changes..."
                    results={this.props.data}
                    title="Wrap all changes from the admin into a new deployment"
                    explainer="This will create a zip file you can download containing the new versions of the data files to be commited and deployed"
                    clicked={this.deploy}
                    buttonText="Go"
                    error={this.props.error}
                    successBox={successBox}
                    />
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        processing: state.admin.deploys.save.processing,
        error: state.admin.deploys.save.error,
        data: state.admin.deploys.save.data,
        download_info: state.admin.deploys.save.info,
        token: state.admin.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveDeploy: () => dispatch(actions.saveNewDeployment()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminAdvancedSave));
