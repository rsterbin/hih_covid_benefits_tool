import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import ActionButtons from '../../../../components/Admin/ActionButtons/ActionButtons';
import Table from '../../../../components/UI/Table/Table';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

class AdminContactsListRaw extends Component {

    cols = [
        { key: 'email', title: 'Email' },
        { key: 'zip', title: 'ZIP Code' }
    ];

    refresh = () => {
        this.props.fetchContacts();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Contacts/ListRaw');
        this.props.fetchContacts();
    }

    render() {
        Logger.setComponent('Admin/Contacts/ListRaw');
        let body = null;
        if (this.props.loaded) {
            let rows = this.props.contacts
                .sort()
                .map(contact => {
                    return {
                        email: contact.email,
                        zip: contact.zip_code
                    };
                });
            const url = Api.getRawContactsDownloadUrl(this.props.token);
            const now = DateTime.local();
            const filename = 'hnct-' + now.toISODate() + '-contacts.csv';
            console.log(url);
            body = (
                <Aux>
                    <h3>Raw Contacts</h3>
                    <ActionButtons buttons={[{icon: "fas fa-download",
                        title: 'Download',
                        link: url,
                        download: filename}]} />
                    <Table
                        rows={rows}
                        cols={this.cols} />
                </Aux>
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
                title="Contacts: Raw"
                breadcrumbs={['Admin', 'Contacts', 'List Raw']}>
                {body}
            </AdminPage>
        );
    }

}

const mapStateToProps = state => {
    return {
        token: state.admin.auth.token,
        loaded: state.admin.contacts.listraw.loaded,
        error: state.admin.contacts.listraw.error,
        contacts: state.admin.contacts.listraw.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchContacts: () => dispatch(actions.loadContactsRaw())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminContactsListRaw));
