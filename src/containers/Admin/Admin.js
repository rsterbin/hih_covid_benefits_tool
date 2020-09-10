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
            const doAdvanced = () => <Advanced token={this.props.token} />;
            const doResources = () => <Resources token={this.props.token} />;
            const doResults = () => <Results token={this.props.token} />;
            const doLanguage = () => <Language token={this.props.token} />;
            const doContacts = () => <Contacts token={this.props.token} />;
            return (
                <AdminLayout>
                    <Switch>
                        <Route path="/admin/advanced" render={doAdvanced} />
                        <Route path="/admin/resources" render={doResources} />
                        <Route path="/admin/results" render={doResults} />
                        <Route path="/admin/language" render={doLanguage} />
                        <Route path="/admin/responses" component={Responses} />
                        <Route path="/admin/contacts" render={doContacts} />
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
        token: state.admin.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        checkAuthState: () => dispatch(actions.checkAdminAuthState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
