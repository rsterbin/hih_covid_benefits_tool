import React, { Component } from 'react';

import Block from '../../../components/Admin/DashboardBlock/DashboardBlock';

class AdminDashboard extends Component {

    state = {
        loaded_recent_responses: false,
        recent_responses: null,
        loaded_recent_contacts: false,
        recent_contacts: null
    };

    recent_responses_headers = [
        { key: 'type', title: 'Employee Type' },
        { key: 'books', title: 'On the Books?' },
        { key: 'agency', title: 'Agency?' },
    ];

    recent_contacts_headers = [
        { key: 'email', title: 'Email' },
        { key: 'ZIP', title: 'ZIP Code' },
    ];

    render() {
        return (
            <div className="Dashboard">
                <Block
                    title="Recent Responses"
                    loaded={this.state.loaded_recent_responses}
                    rows={this.state.recent_responses}
                    cols={this.recent_responses_headers} />
                <Block
                    title="Recent Contacts"
                    loaded={this.state.loaded_recent_contacts}
                    rows={this.state.recent_contacts}
                    cols={this.recent_contacts_headers} />
            </div>
        );
    }
}

export default AdminDashboard;
