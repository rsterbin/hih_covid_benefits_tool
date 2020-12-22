import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Advanced from './Advanced/Advanced';
import Results from './Results/Results';
import Resources from './Resources/Resources';
import Language from './Language/Language';
import Dashboard from './Dashboard/Dashboard';
import Responses from './Responses/Responses';
import Contacts from './Contacts/Contacts';
import AdminLayout from '../../hoc/AdminLayout/AdminLayout';
import Login from '../Login/Login';
import * as actions from '../../storage/redux/actions/index';

import './Admin.css';

class Admin extends Component {

    componentDidMount() {
        this.props.checkAuthState();
    }

    render() {
        if (this.props.authenticated) {
            return (
                <AdminLayout>
                    <Switch>
                        <Route path="/admin/advanced" component={Advanced} />
                        <Route path="/admin/resources" component={Resources} />
                        <Route path="/admin/results" component={Results} />
                        <Route path="/admin/language" component={Language} />
                        <Route path="/admin/responses" component={Responses} />
                        <Route path="/admin/contacts" component={Contacts} />
                        <Route path="/admin" component={Dashboard} />
                    </Switch>
                </AdminLayout>
            );

        } else {
            const header = 'Admin Login';
            return (
                <div className="AdminLogin">
                    <Login header={header} />
                </div>
            );
        }
    }

}

const mapStateToProps = state => {
    return {
        authenticated: state.admin.auth.username === null ? false : true,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        checkAuthState: () => dispatch(actions.checkAdminAuthState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
