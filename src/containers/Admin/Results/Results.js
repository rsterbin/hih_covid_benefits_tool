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
        const doFilter = () => {
            return <Filter token={this.props.token} />;
        };
        return (
            <Switch>
                <Route path="/admin/results/:benefit/edit/:id" render={doEdit} />
                <Route path="/admin/results/:benefit" render={doFilter} />
                <Route path="/" component={List} />
            </Switch>
        );
    }

}

export default AdminResults;
