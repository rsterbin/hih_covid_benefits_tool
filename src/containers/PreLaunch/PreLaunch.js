import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import Main from '../Main/Main';
import Login from '../Login/Login';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import PreLaunchCookie from '../../storage/cookies/PreLaunchCookie';
import Api from '../../storage/Api';
import Logger from '../../utils/Logger';

class PreLaunch extends Component {

    state = {
        loggedIn: false,
        loaded: false
    };

    updateLogin = (token) => {
        this.setState({ loggedIn: true, loaded: true });
        PreLaunchCookie.set(token);
    };

    componentDidMount() {
        let token = PreLaunchCookie.get();
        if (token) {
            Api.checkPrelaunchToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true, loaded: true });
                })
                .catch(error => {
                    if (!error.isAxiosError) {
                        throw error;
                    }
                    const parsed = Api.parseAxiosError(error);
                    if (parsed.code !== 'TOKEN_INVALID') {
                        Logger.alert('Prelaunch session check failed', { api_error: parsed });
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
            return <Main />;
        } else {
            return (
                <LoginLayout>
                    <Login
                        login_type="prelaunch"
                        updateLoginState={this.updateLogin} />
                </LoginLayout>
            );
        }
    }
}

export default PreLaunch;
