import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import Edit from './Edit/Edit';

class AdminLanguage extends Component {

    render() {
        return (
            <Switch>
                <Route path="/admin/language/edit/:key" component={Edit} />
                <Route path="/admin/language/:section" component={List} />
                <Route path="/" component={List} />
            </Switch>
        );
    }
}

export default AdminLanguage;
