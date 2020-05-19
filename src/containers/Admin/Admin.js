import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Language from './Language/Language';
import Dashboard from './Dashboard/Dashboard';

class Admin extends Component {

    render() {
        return (
            <div className="Admin">
                <Switch>
                    <Route path="/language" render={() => <Language />} />
                    <Route path="/" render={() => <Dashboard />} />
                </Switch>
            </div>
        );
    }

}

export default Admin;
