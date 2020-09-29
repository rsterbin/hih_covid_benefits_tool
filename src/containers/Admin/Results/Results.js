import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import List from './List/List';
import Filter from './Filter/Filter';
import Edit from './Edit/Edit';

class AdminResults extends Component {

    render() {
        const doEdit = () => {
            return <Edit token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/admin/results/:benefit/edit/:id" render={doEdit} />
                <Route path="/admin/results/:benefit" component={Filter} />
                <Route path="/" component={List} />
            </Switch>
        );
    }

}

export default AdminResults;
