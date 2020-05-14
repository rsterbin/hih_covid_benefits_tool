import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import Layout from '../../hoc/Layout/Layout';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import BenefitsTool from '../../containers/BenefitsTool/BenefitsTool';
import Login from '../../containers/Login/Login';
import LoginCookie from '../../storage/cookies/LoginCookie';
import CookieNotice from '../CookieNotice/CookieNotice';
import Api from '../../storage/Api';

class PreLaunch extends Component {

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
            Api.checkToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true, loaded: true });
                })
                .catch(error => {
                    console.log(error);
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
