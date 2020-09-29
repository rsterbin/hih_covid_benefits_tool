import React, { Component } from 'react';
import { connect } from 'react-redux';

import Block from '../../../components/Admin/DashboardBlock/DashboardBlock';
import Logger from '../../../utils/Logger';
import * as actions from '../../../storage/redux/actions/index';

class AdminDashboard extends Component {

    responses_headers = [
        { key: 'date', title: 'Date' },
        { key: 'type', title: 'Employee Type' },
        { key: 'agency', title: 'Agency?' },
        { key: 'books', title: 'On the Books?' },
    ];

    contacts_headers = [
        { key: 'email', title: 'Email' },
        { key: 'zip', title: 'ZIP Code' },
    ];

    componentDidMount() {
        Logger.setComponent('Admin/Dashboard');
        this.props.fetchResponses();
        this.props.fetchContacts();
    }

    refreshResponses = () => {
        this.props.fetchResponses();
    };

    refreshContacts = () => {
        this.props.fetchContacts();
    };

    render() {
        Logger.setComponent('Admin/Dashboard');
        return (
            <div className="Dashboard">
                <Block
                    title="Recent Responses"
                    loaded={this.props.responses.loaded}
                    error={this.props.responses.error}
                    refresh={this.refreshResponses}
                    rows={this.props.responses.data}
                    cols={this.responses_headers}
                    more="/admin/responses" />
                <Block
                    title="Recent Contacts"
                    loaded={this.props.contacts.loaded}
                    error={this.props.contacts.error}
                    refresh={this.refreshContacts}
                    rows={this.props.contacts.data}
                    cols={this.contacts_headers}
                    more="/admin/contacts" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        responses: state.admin.dashboard.responses,
        contacts: state.admin.dashboard.contacts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchResponses: () => dispatch(actions.loadDashboardResponses()),
        fetchContacts: () => dispatch(actions.loadDashboardContacts())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
