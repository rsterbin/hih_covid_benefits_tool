import React, { Component } from 'react';

import Spinner from '../../components/UI/Spinner/Spinner';
import Layout from '../../hoc/Layout/Layout';
import BenefitsTool from '../BenefitsTool/BenefitsTool';
import CookieNotice from '../CookieNotice/CookieNotice';
import Language from '../../utils/Language';

class PostLaunch extends Component {

    state = {
        loaded: false
    };

    componentDidMount() {
        this.lang = {
            layout: {
                logo_alt_text: Language.get('layout_logo_alt_text'),
                header_title: Language.get('layout_header_title')
            }
        };
        this.setState({ loaded: true });
    }

    render() {
        if (!this.state.loaded) {
            return <Spinner />;
        }

        return (
            <Layout lang={this.lang.layout}>
                <BenefitsTool />
                <CookieNotice />
            </Layout>
        );
    }
}

export default PostLaunch;
