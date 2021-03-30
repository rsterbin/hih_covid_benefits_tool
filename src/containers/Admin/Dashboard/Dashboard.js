import React, { Component } from 'react';
import { connect } from 'react-redux';

import Block from '../../../components/Admin/DashboardBlock/DashboardBlock';
import Table from '../../../components/UI/Table/Table';
import PieChart from '../../../components/Admin/Charts/Pie/Pie';
import Logger from '../../../utils/Logger';
import * as actions from '../../../storage/redux/actions/index';
import { statsToChartData } from '../../../utils/dashboard';

class AdminDashboard extends Component {

    componentDidMount() {
        Logger.setComponent('Admin/Dashboard');
        this.props.fetchResponses();
        this.props.fetchContacts();
        this.props.fetchStats('books');
        this.props.fetchStats('type');
    }

    refreshResponses = () => {
        this.props.fetchResponses();
    };

    refreshContacts = () => {
        this.props.fetchContacts();
    };

    refreshStatsBooks = () => {
        this.props.fetchStats('books');
    };

    refreshStatsType = () => {
        this.props.fetchStats('type');
    };

    render() {
        Logger.setComponent('Admin/Dashboard');

        const blocks = [];

        // Responses
        let responses = null;
        if (this.props.responses.loaded && this.props.responses.data.length > 0) {
            const rcols = [
                { key: 'date', title: 'Date' },
                { key: 'type', title: 'Employee Type' },
                { key: 'agency', title: 'Agency?' },
                { key: 'books', title: 'On the Books?' },
            ];
            responses = <Table size="tiny" rows={this.props.responses.data} cols={rcols} />;
        }
        blocks.push(<Block
            key="responses"
            title="Recent Responses"
            loaded={this.props.responses.loaded}
            error={this.props.responses.error}
            refresh={this.refreshResponses}
            more="/admin/responses">
            {responses}
        </Block>);

        // Contacts
        let contacts = null;
        if (this.props.contacts.loaded && this.props.contacts.data.length > 0) {
            const ccols = [
                { key: 'email', title: 'Email' },
                { key: 'zip', title: 'ZIP Code' },
            ];
            contacts = <Table size="tiny" rows={this.props.contacts.data} cols={ccols} />;
        }
        blocks.push(<Block
            title="Recent Contacts"
            key="contacts"
            loaded={this.props.contacts.loaded}
            error={this.props.contacts.error}
            refresh={this.refreshContacts}
            more="/admin/contacts">
            {contacts}
        </Block>);

        // On the Books chart
        let bchart = null;
        if (this.props.stats.books.loaded && Object.keys(this.props.stats.books.data).length > 0) {
            bchart = (
                <PieChart data={statsToChartData(this.props.stats.books.data)} />
            );
        }
        blocks.push(<Block
            title="On the Books"
            key="chart_books"
            loaded={this.props.stats.books.loaded}
            error={this.props.stats.books.error}
            refresh={this.refreshStatsBooks}>
            {bchart}
        </Block>);

        // Employee Type chart
        let tchart = null;
        if (this.props.stats.type.loaded && Object.keys(this.props.stats.type.data).length > 0) {
            tchart = (
                <PieChart data={statsToChartData(this.props.stats.type.data)} />
            );
        }
        blocks.push(<Block
            title="Employee Type"
            key="chart_type"
            loaded={this.props.stats.type.loaded}
            error={this.props.stats.type.error}
            refresh={this.refreshStatsType}>
            {tchart}
        </Block>);

        return (
            <div className="Dashboard">
                {blocks}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        responses: state.admin.dashboard.responses,
        contacts: state.admin.dashboard.contacts,
        stats: state.admin.dashboard.stats
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchResponses: () => dispatch(actions.loadDashboardResponses()),
        fetchContacts: () => dispatch(actions.loadDashboardContacts()),
        fetchStats: (key) => dispatch(actions.loadDashboardStats(key))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
