import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import ListRaw from './ListRaw/ListRaw';
import Download from './Download/Download';
import Clean from './Clean/Clean';

class AdminContacts extends Component {

    render() {
        const doList = () => {
            return <List token={this.props.token} />;
        };
        const doListRaw = () => {
            return <ListRaw token={this.props.token} />;
        };
        const doDownload = () => {
            return <Download token={this.props.token} />;
        };
        const doClean = () => {
            return <Clean token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/admin/contacts/download" render={doDownload} />
                <Route path="/admin/contacts/clean" render={doClean} />
                <Route path="/admin/contacts/raw" render={doListRaw} />
                <Route path="/" render={doList} />
            </Switch>
        );
    }

}

export default AdminContacts;
