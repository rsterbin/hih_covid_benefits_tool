import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import Edit from './Edit/Edit';

class AdminLanguage extends Component {

    render() {
        const doEdit = () => {
            return <Edit token={this.props.token} />;
        };
        const doList = () => {
            return <List token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/admin/language/:key" render={doEdit} />
                <Route path="/" render={doList} />
            </Switch>
        );
    }
}

export default AdminLanguage;
