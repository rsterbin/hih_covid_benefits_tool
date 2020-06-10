import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Advanced from './Advanced/Advanced';
import Results from './Results/Results';
import Resources from './Resources/Resources';
import Language from './Language/Language';
import Dashboard from './Dashboard/Dashboard';
import AdminLayout from '../../hoc/AdminLayout/AdminLayout';
import Login from '../Login/Login';
import Spinner from '../../components/UI/Spinner/Spinner';
import LoginCookie from '../../storage/cookies/LoginCookie';
import Api from '../../storage/Api';
import Logger from '../../utils/Logger';

import './Admin.css';

// TODO: Use context to pass the token to children?
// const TokenContext = React.createContext(null);
// TODO: Use react-idle-timer to trigger token updates?
// https://github.com/SupremeTechnopriest/react-idle-timer

class Admin extends Component {

    state = {
        loggedIn: false,
        loaded: false,
        token: null
    };

    updateLogin = (token) => {
        this.setState({ loggedIn: true, loaded: true, token: token });
        LoginCookie.set(token);
    };

    componentDidMount() {
        let token = LoginCookie.get();
        if (token) {
            Api.checkAdminToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true, loaded: true, token: token });
                })
                .catch(error => {
                    if (!error.isAxiosError) {
                        throw error;
                    }
                    const parsed = Api.parseAxiosError(error);
                    if (parsed.code !== 'TOKEN_INVALID') {
                        Logger.alert('Admin session check failed', { api_error: parsed });
                    }
                    this.setState({ loaded: true });
                });
        } else {
            this.setState({ loaded: true });
        }
    }

    render() {
        if (!this.state.loaded) {
            return <Spinner />;
        }

        if (this.state.loggedIn) {
            const doAdvanced = () => <Advanced token={this.state.token} />;
            const doResources = () => <Resources token={this.state.token} />;
            const doResults = () => <Results token={this.state.token} />;
            const doLanguage = () => <Language token={this.state.token} />;
            const doDashboard = () => <Dashboard token={this.state.token} />;
            return (
                <AdminLayout>
                    <Switch>
                        <Route path="/admin/advanced" render={doAdvanced} />
                        <Route path="/admin/resources" render={doResources} />
                        <Route path="/admin/results" render={doResults} />
                        <Route path="/admin/language" render={doLanguage} />
                        <Route path="/admin" render={doDashboard} />
                    </Switch>
                </AdminLayout>
            );

        } else {
            const header = 'Admin Login';
            return (
                <div className="AdminLogin">
                    <Login header={header} updateLoginState={this.updateLogin} />
                </div>
            );
        }
    }

}

export default Admin;
