import React, { Component } from 'react';
import { DateTime } from 'luxon';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Table from '../../../../components/UI/Table/Table';
import Message from '../../../../components/UI/Message/Message';
import IconButton from '../../../../components/UI/IconButton/IconButton';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import './List.css';

class AdminAdvancedList extends Component {

    state = {
        loaded: false,
        deploys: null,
        error: null
    };

    cols = [
        { key: 'version_num', title: 'Version Number' },
        { key: 'deploy_date', title: 'Created At' },
        { key: 'download', title: 'Download' },
    ];

    refresh = () => {
        this.fetchDeploys();
    };

    componentDidMount() {
        this.fetchDeploys();
    }

    fetchDeploys() {
        this.setState({ loaded: false, deploys: null, error: null });
        const data = { token: this.props.token };
        Api.getAllDeploys(data)
            .then((response) => {
                const all = response.data.all ? response.data.all : [];
                this.setState({ loaded: true, deploys: all });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch deployments', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch deployments' });
            });
    }

    render() {
        let body = null;
        if (this.state.loaded) {
            const rows = this.state.deploys.map(item => {
                const dt = DateTime.fromISO(item.date_deployed);
                const formatted = dt.toLocaleString(DateTime.DATETIME_SHORT);
                const url = Api.getDownloadUrl(
                    item.version_num,
                    item.hash,
                    this.props.token);
                const fname = 'hnct-' + item.version_num + '.zip';
                const download = (
                    <a className="DownloadDeploy" download={fname} href={url}>
                        <i className="fas fa-download" title="download"></i>
                    </a>
                );
                return {
                    version_num: item.version_num,
                    hash: item.hash,
                    deploy_date: formatted,
                    download: download
                };
            });
            body = (
                <div className="DeployList">
                    <div className="RefreshWrapper">
                    <IconButton icon_type="refresh"
                        clicked={this.refresh} />
                    </div>
                    <Table rows={rows} cols={this.cols} />
                </div>
            );
        } else {
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
            <AdminPage
                title="Advanced Functions: Deployments"
                breadcrumbs={['Admin', 'Advanced', 'Deployments']}
                advanced={true}>
                <DeployMessage />
                {body}
            </AdminPage>
        );
    }

}

export default AdminAdvancedList;
