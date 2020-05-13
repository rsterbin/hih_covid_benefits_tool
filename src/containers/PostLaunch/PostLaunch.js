import React, { Component } from 'react';

import Layout from '../../hoc/Layout/Layout';
import BenefitsTool from '../BenefitsTool/BenefitsTool';
import CookieNotice from '../CookieNotice/CookieNotice';

class PostLaunch extends Component {

    render() {
        return (
            <Layout>
                <BenefitsTool />
                <CookieNotice />
            </Layout>
        );
    }
}

export default PostLaunch;
