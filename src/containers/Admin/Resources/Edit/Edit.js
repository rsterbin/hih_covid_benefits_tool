import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

import EditForm from '../../../../components/Admin/Forms/EditResource/EditResource';

class AdminResourcesEdit extends Component {

    submit = (values) => {
        this.props.saveResource(this.props.resource.data, this.props.benefits.data, values);
    };

    refresh = () => {
        this.loadAll();
    };

    closeSavedMessage = () => {
        this.props.closeMsg();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Resources/Edit');
        this.loadAll();
    }

    getId() {
        if (this.props.match.params.id) {
            return this.props.match.params.id;
        } else {
            return null;
        }
    }

    loadAll() {
        this.props.fetchBenefits();
        const id = this.getId();
        if (id) {
            this.props.fetchResource(id);
        }
    }

    isLoaded() {
        if (!this.props.benefits.loaded) {
            return false;
        }
        if (!this.getId()) {
            return true;
        }
        if (!this.props.resource.loaded) {
            return false;
        }
        return true;
    }

    render() {
        Logger.setComponent('Admin/Resources/Edit');

        let body = null;
        let title = 'Resources: Edit';
        let crumbs = ['Admin', 'Resources'];

        if (this.isLoaded()) {

            let redirect = null;
            if (this.props.save.reload_id) {
                redirect = <Redirect to={'/admin/resources/edit/' + this.props.save.reload_id} />;
            }

            let prefill = {};
            if (this.props.resource.data === null) {
                title = 'Resources: New';
            } else {
                prefill.benefit_id = this.props.resource.data.benefit ? this.props.resource.data.benefit.id : null;
                prefill.link_en = this.props.resource.data.links.en;
                prefill.en_text = this.props.resource.data.en_text;
                prefill.en_desc = this.props.resource.data.en_desc;
            }

            console.log(this.props);

            body = (
                <Aux>
                    {redirect}
                    <EditForm
                        saved={this.props.save.saved ? 'The resource has been saved' : null}
                        onCloseMsg={this.closeSavedMessage}
                        benefits={this.props.benefits.data}
                        submitAction={this.submit}
                        prefill={prefill} />
                </Aux>
            );
        } else {
            body = (
                <Aux>
                    {this.props.save.error ?
                        <Message type="error" text={this.props.save.error} tryagain={this.refresh} />
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
        benefits: state.admin.shared.benefits,
        resource: state.admin.resources.info,
        save: state.admin.resources.save
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchBenefits: () => dispatch(actions.loadBenefitsList()),
        fetchResource: (id) => dispatch(actions.loadResourceInfo(id)),
        saveResource: (old, benefits, form) => dispatch(actions.saveResource(old, benefits, form)),
        closeMsg: () => dispatch(actions.adminSaveResourceMsgDismissed())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminResourcesEdit));
