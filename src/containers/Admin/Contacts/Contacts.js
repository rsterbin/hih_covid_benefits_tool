import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ListRaw from './ListRaw/ListRaw';

class AdminContacts extends Component {

    render() {
        const doListRaw = () => {
            return <ListRaw token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/" render={doListRaw} />
            </Switch>
        );
    }

}

export default AdminContacts;
