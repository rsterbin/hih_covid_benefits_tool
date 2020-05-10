import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import LoginLayout from './hoc/LoginLayout/LoginLayout';
import BenefitsTool from './containers/BenefitsTool/BenefitsTool';
import Login from './containers/Login/Login';

import './App.css';

class App extends Component {

    state = {
        loggedIn: false,
    };

    updateLogin = (loginState) => {
        this.setState({ loggedIn: loginState });
    };

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
