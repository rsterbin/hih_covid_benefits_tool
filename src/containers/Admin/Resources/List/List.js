import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import ConfirmDeleteResource from '../../../../components/Admin/ConfirmDeleteResource/ConfirmDeleteResource';
import ActionButtons from '../../../../components/Admin/ActionButtons/ActionButtons';
import Table from '../../../../components/UI/Table/Table';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

const COMMON_CODE = 'common';

// TODO: Actually delete a resource

class AdminResourcesList extends Component {

    state = {
        loaded: false,
        confirming_delete: false,
        delete_candidate: null,
        benefit: null,
        error: null
    };

    resources_clickable = {
        edit: (row) => { this.editResource(row); },
        delete: (row) => { this.deleteResource(row); },
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
        this.fetchResources(true);
    };

    cancelDelete = () => {
        this.setState({ confirming_delete: false, delete_candidate: null });
    };

    componentDidMount() {
        this.fetchResources(true);
    }

    fetchResources(fetch_all) {
        this.setState({ loaded: false, resources: null, error: null });
        const data = { token: this.props.token };
        Api.getResources(data, this.getBenefitCode())
            .then((response) => {
                const resources = response.data.resources ? response.data.resources : [];
                if (fetch_all) {
                    this.setState({ resources: resources });
                    this.fetchBenefit();
                } else {
                    this.setState({ loaded: true, resources: resources });
                }
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch resources', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch resources' });
            });
    }

    fetchBenefit() {
        const b_code = this.getBenefitCode();
        if (b_code && b_code !== COMMON_CODE) {
            this.setState({ loaded: false, benefit: null, error: null });
            const data = { token: this.props.token };
            Api.getBenefitInfo(this.getBenefitCode(), data)
                .then((response) => {
                    if (!response.data.benefit) {
                        this.setState({ error: 'That benefit is unknown' });
                    } else {
                        this.setState({ loaded: true, benefit: response.data.benefit });
                    }
                })
                .catch((error) => {
                    if (!error.isAxiosError) {
                        throw error;
                    }
                    Logger.alert('Could not fetch benefit', { api_error: Api.parseAxiosError(error) });
                    this.setState({ error: 'Could not fetch benefit' });
                });
        } else {
            this.setState({ loaded: true });
        }
    }

    editResource(row) {
        this.props.history.push('/admin/resources/edit/' + row.id);
    }

    deleteResource(row) {
        this.setState({ confirming_delete: true, delete_candidate: row });
    }

    getBenefitCode() {
        return this.props.match.params.benefit;
    }

    render() {
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin' ];
        if (this.state.loaded) {
            if (this.state.benefit) {
                title += this.state.benefit.abbreviation + ': Resources';
                crumbs.push(this.state.benefit.abbreviation);
                crumbs.push('Resources');
            } else if (this.getBenefitCode() === COMMON_CODE) {
                title += 'Common Resources';
                crumbs.push('Resources');
            } else {
                title += 'All Resources';
                crumbs.push('Resources');
            }
            let resources_rows = this.state.resources
                .map(resource => {
                    let row = {
                        id: resource.id,
                        code: resource.code,
                        text: resource.en_text,
                        desc: resource.en_desc,
                        link: resource.links.en,
                        edit: <i className="fas fa-pencil-alt" title="Edit Resource"></i>,
                        delete: <i className="fas fa-trash-alt" title="Delete Resource"></i>
                    };
                    if (!this.state.benefit) {
                        row.benefit = resource.benefit || 'Common';
                    }
                    return row;
                });
            let resources_cols = [];
            if (!this.state.benefit) {
                resources_cols.push({ key: 'benefit', title: 'Benefit' });
            }
            resources_cols.push({ key: 'link', title: 'Link' });
            resources_cols.push({ key: 'text', title: 'Text' });
            resources_cols.push({ key: 'edit', title: 'Edit' });
            resources_cols.push({ key: 'delete', title: 'Delete' });
            body = (
                <Aux>
                    <ConfirmDeleteResource
                        confirming={this.state.confirming_delete}
                        cancel={this.cancelDelete}
                        candidate={this.state.delete_candidate} />
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
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
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

export default withRouter(AdminResourcesList);
