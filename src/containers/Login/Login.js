import React, { Component } from 'react';

import LoginBox from '../../components/LoginBox/LoginBox';
import Api from '../../utils/Api';

class Login extends Component {

    state = {
        loading: false,
        username: '',
        password: '',
        loginError: false
    };

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
            this.setState({
                loading: false,
            });
            this.props.updateLoginState(response.data.token);
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            this.setState({ 
                loading: false,
                loginError: true
            });
        });
    }

    render() {
        return <LoginBox
            loading={this.state.loading}
            loginError={this.state.loginError}
            username={this.state.username}
            password={this.state.password}
            usernameChanged={this.changeUsername}
            passwordChanged={this.changePassword}
            submitted={this.validate} />;
    }

}

export default Login;
