import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import Edit from './Edit/Edit';

class AdminResources extends Component {

    render() {
        return (
            <Switch>
                <Route path="/admin/resources/edit/:id" component={Edit} />
                <Route path="/admin/resources/new/:benefit" component={Edit} />
                <Route path="/admin/resources/new" component={Edit} />
                <Route path="/admin/resources/:benefit" component={List} />
                <Route path="/" component={List} />
            </Switch>
        );
    }

}

export default AdminResources;
