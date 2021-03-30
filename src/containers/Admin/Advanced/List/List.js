import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Table from '../../../../components/UI/Table/Table';
import Message from '../../../../components/UI/Message/Message';
import IconButton from '../../../../components/UI/IconButton/IconButton';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

import './List.css';

class AdminAdvancedList extends Component {

    cols = [
        { key: 'version_num', title: 'Version Number' },
        { key: 'deploy_date', title: 'Created At' },
        { key: 'download', title: 'Download' },
        { key: 'load', title: 'Revert' },
        { key: 'compare', title: 'Compare' },
    ];

    refresh = () => {
        this.props.fetchDeploys();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/List');
        this.props.fetchDeploys();
    }

    render() {
        Logger.setComponent('Admin/Advanced/List');
        let body = null;
        if (this.props.loaded) {
            const rows = this.props.deploys.map(item => {
                const dt = DateTime.fromISO(item.date_deployed);
                const formatted = dt.toLocaleString(DateTime.DATETIME_SHORT);
                const url = Api.getDeployDownloadUrl(
                    item.version_num,
                    item.uuid,
                    this.props.token);
                const fname = 'hnct-' + item.version_num + '.zip';
                const download = (
                    <a className="DownloadDeploy" download={fname} href={url}>
                        <i className="fas fa-download" title="Download this version"></i>
                    </a>
                );
                const load = (
                    <Link to={'/admin/advanced/load/' + item.id}>
                        <i className="fas fa-history" title="Revert to this version"></i>
                    </Link>
                );
                const compare = (
                    <Link to={'/admin/advanced/compare/' + item.version_num + '/admin'}>
                        <i className="fas fa-balance-scale-right" title="Compare to the current state of the admin"></i>
                    </Link>
                );
                return {
                    id: item.deployment_id,
                    version_num: item.version_num,
                    uuid: item.uuid,
                    deploy_date: formatted,
                    download: download,
                    load: load,
                    compare: compare,
                };
            });
            body = (
                <div className="DeployList">
                    <div className="RefreshWrapper">
                    <IconButton icon_type="refresh" clicked={this.refresh} />
                    </div>
                    <Table rows={rows} cols={this.cols} />
                </div>
            );
        } else {
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

const mapStateToProps = state => {
    return {
        token: state.admin.auth.token,
        loaded: state.admin.deploys.list.loaded,
        error: state.admin.deploys.list.error,
        deploys: state.admin.deploys.list.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDeploys: () => dispatch(actions.loadDeployments())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminAdvancedList));
