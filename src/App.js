import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import Quiz from './containers/Quiz/Quiz';
import Login from './components/Login/Login';

import Storage from './utils/Storage';

import './App.css';

class App extends Component {
    state = {
        loading: false,
        username: '',
        password: '',
        loggedIn: false,
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
        Storage.checkLogin({
            username: this.state.username,
            password: this.state.password
        })
        .then(response => {
            this.setState({
                loading: false,
                loggedIn: true
            });
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
        let layout = null;
        if (this.state.loggedIn) {
            layout = (
                <Layout>
                    <Quiz />
                </Layout>
            );
        } else {
            layout = <Login
                loading={this.state.loading}
                loginError={this.state.loginError}
                username={this.state.username}
                password={this.state.password}
                usernameChanged={this.changeUsername}
                passwordChanged={this.changePassword}
                submitted={this.validate} />;
        }
        return (
            <div className="App">
                {layout}
            </div>
        );
    }
}

export default App;
