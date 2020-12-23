import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import ConfirmDeleteResource from '../../../../components/Admin/ConfirmDeleteResource/ConfirmDeleteResource';
import ActionButtons from '../../../../components/Admin/ActionButtons/ActionButtons';
import Table from '../../../../components/UI/Table/Table';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

const COMMON_CODE = 'common';

class AdminResourcesList extends Component {

    resources_clickable = {
        delete: (row) => {
            this.props.requestDelete(row);
        },
    };

    resources_snip = {
        link: 40
    };

    newResource = () => {
        const code = this.getBenefitCode();
        if (code && code !== COMMON_CODE) {
            this.props.history.push('/admin/resources/new/' + code);
        } else {
            this.props.history.push('/admin/resources/new');
        }
    }

    refresh = () => {
        this.props.fetchResources();
    };

    cancelDelete = () => {
        this.props.cancelDelete();
    };

    confirmDelete = () => {
        this.props.deleteResource();
    };

    closeDeleteMessage = () => {
        this.props.dismissMessage();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Resources/List');
        const code = this.getBenefitCode();
        this.props.fetchResources(code);
        if (code && code !== COMMON_CODE) {
            this.props.fetchBenefit(code);
        }
    }

    getBenefitCode() {
        return this.props.match.params.benefit;
    }

    render() {
        Logger.setComponent('Admin/Resources/List');
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin' ];
        if (this.props.loaded) {
            if (this.props.benefit) {
                title += this.props.benefit.abbreviation + ': Resources';
                crumbs.push(this.props.benefit.abbreviation);
                crumbs.push('Resources');
            } else if (this.getBenefitCode() === COMMON_CODE) {
                title += 'Common Resources';
                crumbs.push('Resources');
            } else {
                title += 'All Resources';
                crumbs.push('Resources');
            }
            let resources_rows = this.props.data
                .map(resource => {
                    let edit_link = (
                        <Link to={'/admin/resources/edit/' + resource.id}>
                            <i className="fas fa-pencil-alt" title="Edit Resource"></i>
                        </Link>
                    );
                    let row = {
                        id: resource.id,
                        code: resource.code,
                        text: resource.en_text,
                        desc: resource.en_desc,
                        link: resource.links.en,
                        edit: edit_link,
                        delete: <i className="fas fa-trash-alt" title="Delete Resource"></i>
                    };
                    if (!this.props.benefit) {
                        row.benefit = resource.benefit || 'Common';
                    }
                    return row;
                });
            let resources_cols = [];
            if (!this.props.benefit) {
                resources_cols.push({ key: 'benefit', title: 'Benefit' });
            }
            resources_cols.push({ key: 'link', title: 'Link' });
            resources_cols.push({ key: 'text', title: 'Text' });
            resources_cols.push({ key: 'edit', title: 'Edit' });
            resources_cols.push({ key: 'delete', title: 'Delete' });
            body = (
                <Aux>
                    {this.props.deleted ?
                        <Message type="success" text="The resource was deleted" closed={this.closeDeleteMessage} />
                    : null}
                    <ConfirmDeleteResource
                        confirming={this.props.confirming_delete}
                        working={this.props.processing_delete}
                        confirm={this.confirmDelete}
                        cancel={this.cancelDelete}
                        candidate={this.props.delete_candidate} />
                    <ActionButtons buttons={[{icon: "fas fa-plus-circle",
                        title: "New Resource",
                        clicked: this.newResource}]} />
                    <Table
                        rows={resources_rows}
                        cols={resources_cols}
                        clickable={this.resources_clickable}
                        snip={this.resources_snip} />
                </Aux>
            );

        } else {
            title += 'Resources';
            crumbs.push('Resources');

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
            <AdminPage title={title} breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        loaded: state.admin.resources.list.loaded,
        error: state.admin.resources.list.error,
        data: state.admin.resources.list.data,
        benefit: state.admin.resources.list.current_benefit,
        delete_candidate: state.admin.resources.delete.candidate,
        confirming_delete: state.admin.resources.delete.confirming,
        processing_delete: state.admin.resources.delete.processing,
        deleted: state.admin.resources.delete.deleted
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchResources: () => dispatch(actions.loadResourcesList()),
        fetchBenefit: (code) => dispatch(actions.loadBenefit(code)),
        requestDelete: (candidate) => dispatch(actions.adminRequestResourceDelete(candidate)),
        cancelDelete: () => dispatch(actions.adminCancelResourceDelete()),
        deleteResource: () => dispatch(actions.deleteResource()),
        dismissMessage: () => dispatch(actions.adminDismissDeleteResourceMessage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminResourcesList));
