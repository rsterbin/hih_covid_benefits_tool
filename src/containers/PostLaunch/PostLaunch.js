import React, { Component } from 'react';

import Layout from '../../hoc/Layout/Layout';
import BenefitsTool from '../../containers/BenefitsTool/BenefitsTool';

class PostLaunch extends Component {

    render() {
        return (
            <Layout>
                <BenefitsTool />
            </Layout>
        );
    }
}

export default PostLaunch;
