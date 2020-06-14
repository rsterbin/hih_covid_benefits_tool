import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import Edit from './Edit/Edit';

class AdminResources extends Component {

    render() {
        const doEdit = () => {
            return <Edit token={this.props.token} />;
        };
        const doList = () => {
            return <List token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/admin/resources/edit/:id" render={doEdit} />
                <Route path="/admin/resources/new/:benefit" render={doEdit} />
                <Route path="/admin/resources/new" render={doEdit} />
                <Route path="/admin/resources/:benefit" render={doList} />
                <Route path="/" render={doList} />
            </Switch>
        );
    }

}

export default AdminResources;
