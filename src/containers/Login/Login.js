import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import LoginBox from '../../components/LoginBox/LoginBox';
import Api from '../../storage/Api';
import Language from '../../utils/Language';
import Logger from '../../utils/Logger';

class Login extends Component {

    state = {
        loading: false,
        username: '',
        password: '',
        loginError: false,
        loaded_lang: false
    };

    lang = null;

    changeUsername = (e) => {
        this.setState({ username: e.target.value });
    };

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    };

    validate = (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            loginError: false
        });
        Api.checkLogin({
            username: this.state.username,
            password: this.state.password
        })
        .then(response => {
            if (response.data.token) {
                this.setState({
                    loading: false,
                });
                this.props.updateLoginState(response.data.token);
            } else {
                Logger.alert('Prelaunch log in succeeded without returning a token', { returned: response.data });
                this.setState({
                    loading: false,
                    loginError: true
                });
            }
        })
        .catch(error => {
            const parsed = Api.parseAxiosError(error);
            if (parsed.code !== 'LOGIN_INCORRECT' &&
                parsed.code !== 'USERNAME_REQUIRED' &&
                parsed.code !== 'PASSWORD_REQUIRED') {
                Logger.alert('Prelaunch log in failed', { api_error: parsed });
            }
            this.setState({
                loading: false,
                loginError: true
            });
        });
    }

    componentDidMount() {
        this.lang = {
            button_text: Language.get('prelaunch_login_button_text'),
            login_error: Language.get('prelaunch_login_error'),
            username_label: Language.get('prelaunch_login_username_label'),
            password_label: Language.get('prelaunch_login_password_label'),
        };
        this.setState({ loaded_lang: true });
    }

    render() {
        if (!this.state.loaded_lang) {
            return <Spinner />;
        }
        return <LoginBox
            loading={this.state.loading}
            loginError={this.state.loginError}
            username={this.state.username}
            password={this.state.password}
            usernameChanged={this.changeUsername}
            passwordChanged={this.changePassword}
            submitted={this.validate}
            lang={this.lang} />;
    }

}

export default Login;
