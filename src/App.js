import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import LoginLayout from './hoc/LoginLayout/LoginLayout';
import BenefitsTool from './containers/BenefitsTool/BenefitsTool';
import Login from './containers/Login/Login';
import LoginCookie from './utils/LoginCookie';
import Api from './utils/Api';

import './App.css';

class App extends Component {

    state = {
        loggedIn: false,
    };

    updateLogin = (token) => {
        this.setState({ loggedIn: true });
        LoginCookie.set(token);
    };

    componentDidMount() {
        let token = LoginCookie.get();
        if (token) {
            Api.checkToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
    render() {
        let layout = null;
        if (this.state.loggedIn) {
            layout = (
                <Layout>
                    <BenefitsTool />
                </Layout>
            );
        } else {
            layout = (
                <LoginLayout>
                    <Login updateLoginState={this.updateLogin} />
                </LoginLayout>
            );
        }
        return (
            <div className="App">
                {layout}
            </div>
        );
    }
}

export default App;
