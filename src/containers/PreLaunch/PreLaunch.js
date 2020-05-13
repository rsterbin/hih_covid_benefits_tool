import React, { Component } from 'react';

import Layout from '../../hoc/Layout/Layout';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import BenefitsTool from '../../containers/BenefitsTool/BenefitsTool';
import Login from '../../containers/Login/Login';
import LoginCookie from '../../utils/LoginCookie';
import CookieNotice from '../CookieNotice/CookieNotice';
import Api from '../../utils/Api';

class PreLaunch extends Component {

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
        if (this.state.loggedIn) {
            return (
                <Layout>
                    <BenefitsTool />
                    <CookieNotice />
                </Layout>
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

export default PreLaunch;
