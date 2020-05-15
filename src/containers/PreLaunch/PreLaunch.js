import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import Layout from '../../hoc/Layout/Layout';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import BenefitsTool from '../../containers/BenefitsTool/BenefitsTool';
import Login from '../../containers/Login/Login';
import LoginCookie from '../../storage/cookies/LoginCookie';
import CookieNotice from '../CookieNotice/CookieNotice';
import Api from '../../storage/Api';
import Language from '../../utils/Language';
import Logger from '../../utils/Logger';

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
        this.lang = {
            layout: {
                logo_alt_text: Language.get('layout_logo_alt_text'),
                header_title: Language.get('layout_header_title')
            }
        };
        let token = LoginCookie.get();
        if (token) {
            Api.checkToken({ token: token })
                .then(response => {
                    this.setState({ loggedIn: true, loaded: true });
                })
                .catch(error => {
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
            return (
                <Layout lang={this.lang.layout}>
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
