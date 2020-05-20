import React, { Component } from 'react';
import { DateTime } from 'luxon';

import Block from '../../../components/Admin/DashboardBlock/DashboardBlock';

import Api from '../../../storage/Api';
import Logger from '../../../utils/Logger';

class AdminDashboard extends Component {

    state = {
        responses_loaded: false,
        responses_error: null,
        responses: null,
        contacts_loaded: false,
        contacts_error: null,
        contacts: null,
    };

    responses_headers = [
        { key: 'date', title: 'Date' },
        { key: 'type', title: 'Employee Type' },
        { key: 'books', title: 'On the Books?' },
    ];

    contacts_headers = [
        { key: 'date', title: 'Date' },
        { key: 'email', title: 'Email' },
        { key: 'ZIP', title: 'ZIP Code' },
    ];

    componentDidMount() {
        this.fetchRecentResponses();
        this.fetchRecentContacts();
    }

    refreshResponses = () => {
        this.fetchRecentResponses();
    };

    refreshContacts = () => {
        this.fetchRecentContacts();
    };

    fetchRecentResponses() {
        this.setState({
            responses_loaded: false,
            responses: null,
            responses_error: null });
        const data = { token: this.props.token };
        Api.getRecentResponses(data)
            .then((response) => {
                const recent = response.data.recent ? response.data.recent : [];
                this.setState({ responses_loaded: true, responses: recent });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch recent responses', { api_error: Api.parseAxiosError(error) });
                this.setState({ responses_error: 'Could not fetch recent responses' });
            });
    }

    fetchRecentContacts() {
        this.setState({
            contacts_loaded: false,
            contacts: null,
            contacts_error: null });
        const data = { token: this.props.token };
        Api.getRecentContacts(data)
            .then((response) => {
                const found = response.data.recent ? response.data.recent : [];
                const recent = found.map((row) => {
                    let date = DateTime.fromISO(row.submitted);
                    let formatted = date.month + '/' + date.day;
                    return { ...row, date: formatted };
                });
                this.setState({ contacts_loaded: true, contacts: recent });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch recent contacts', { api_error: Api.parseAxiosError(error) });
                this.setState({ contacts_error: 'Could not fetch recent contacts' });
            });
    }

    render() {
        return (
            <div className="Dashboard">
                <Block
                    title="Recent Responses"
                    loaded={this.state.responses_loaded}
                    error={this.state.responses_error}
                    refresh={this.refreshResponses}
                    rows={this.state.responses}
                    cols={this.responses_headers} />
                <Block
                    title="Recent Contacts"
                    loaded={this.state.contacts_loaded}
                    error={this.state.contacts_error}
                    refresh={this.refreshContacts}
                    rows={this.state.contacts}
                    cols={this.contacts_headers} />
            </div>
        );
    }
}

export default AdminDashboard;
