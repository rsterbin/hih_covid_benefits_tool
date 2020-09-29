import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ListRaw from './ListRaw/ListRaw';

class AdminContacts extends Component {

    render() {
        return (
            <Switch>
                <Route path="/" component={ListRaw} />
            </Switch>
        );
    }

}

export default AdminContacts;
