import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Language from './Language/Language';
import Dashboard from './Dashboard/Dashboard';
import Login from '../Login/Login';
import Spinner from '../../components/UI/Spinner/Spinner';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import LoginCookie from '../../storage/cookies/LoginCookie';
import Api from '../../storage/Api';
import Logger from '../../utils/Logger';

class Admin extends Component {

    state = {
        loggedIn: false,
        loaded: false
    };

    updateLogin = (token) => {
        this.setState({ loggedIn: true, loaded: true });
        LoginCookie.set(token);
    };

    componentDidMount() {
        let token = LoginCookie.get();
        if (token) {
            Api.checkAdminToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true, loaded: true });
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
            return (
                <div className="Admin">
                    <Switch>
                        <Route path="/admin/language" render={() => <Language />} />
                        <Route path="/admin" render={() => <Dashboard />} />
                    </Switch>
                </div>
            );

        } else {
            return (
                <LoginLayout>
                    <Login updateLoginState={this.updateLogin} />
                </LoginLayout>
            );
        }
    }

}

export default Admin;
