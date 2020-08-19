import React, { Component } from 'react';

import Basic from '../../../components/BenefitsTool/Basic/Basic';
import Language from '../../../utils/Language';
import Logger from '../../../utils/Logger';

class PrivacyPolicy extends Component {

    componentDidMount() {
        Logger.setComponent('BenefitsTool/PrivacyPolicy');
    }

    render() {
        Logger.setComponent('BenefitsTool/PrivacyPolicy');
        const lang = {
            header: Language.get('privacy_policy_header'),
            body: Language.get('privacy_policy_text'),
            back_link: Language.get('util_back_to_quiz'),
            back_title: Language.get('util_back_to_quiz')
        };
        return (
            <Basic lang={lang} back="/" />
        );
    }
}

export default PrivacyPolicy;
