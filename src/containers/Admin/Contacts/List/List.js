import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import ActionButtons from '../../../../components/Admin/ActionButtons/ActionButtons';
import Table from '../../../../components/UI/Table/Table';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminContactsList extends Component {

    state = {
        loaded: false,
        contacts: null,
        raw_contact_count: null,
        error: null
    };

    cols = [
        { key: 'email', title: 'Email' },
        { key: 'zip', title: 'ZIP Code' }
    ];

    refresh = () => {
        this.fetchContacts();
    };

    goToRaw = () => {
        this.props.history.push('/admin/contacts/raw');
    };

    goToDownload = () => {
        this.props.history.push('/admin/contacts/download');
    };

    componentDidMount() {
        Logger.setComponent('Admin/Contacts/List');
        this.fetchContacts();
    }

    fetchContacts() {
        this.setState({ loaded: false, contacts: null, raw_contact_count: null, error: null });
        const data = { token: this.props.token };
        Api.getAllContacts(data)
            .then((response) => {
                const contacts = response.data.contacts ? response.data.contacts : [];
                const raw_count = response.data.raw_count ? response.data.raw_count : [];
                this.setState({ loaded: true, contacts: contacts, raw_contact_count: raw_count });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch contacts', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch contacts' });
            });
    }

    render() {
        Logger.setComponent('Admin/Contacts/List');
        let body = null;
        if (this.state.loaded) {
            let rows = this.state.contacts
                .sort()
                .map(contact => {
                    return {
                        email: contact.email,
                        zip: contact.zip_code
                    };
                });
            body = (
                <Aux>
                    <h3>Cleaned Contacts</h3>
                    <ActionButtons buttons={[
                        {icon: "fas fa-mail-bulk", title: this.state.raw_contact_count + ' raw contacts', clicked: this.goToRaw},
                        {icon: "fas fa-download", title: 'Download', clicked: this.goToDownload},
                        ]} />
                    <Table
                        rows={rows}
                        cols={this.cols} />
                </Aux>
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
                title="Contacts: Cleaned"
                breadcrumbs={['Admin', 'Contacts', 'List Cleaned']}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminContactsList);
