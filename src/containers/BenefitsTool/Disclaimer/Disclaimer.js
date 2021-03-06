import React, { Component } from 'react';

import Basic from '../../../components/BenefitsTool/Basic/Basic';
import Language from '../../../utils/Language';
import Logger from '../../../utils/Logger';

class Disclaimer extends Component {

    componentDidMount() {
        Logger.setComponent('BenefitsTool/Disclaimer');
    }

    render() {
        Logger.setComponent('BenefitsTool/Disclaimer');
        const lang = {
            header: Language.get('disclaimer_header'),
            body: Language.get('disclaimer_text'),
            back_link: Language.get('util_back_to_quiz'),
            back_title: Language.get('util_back_to_quiz')
        };
        return (
            <Basic lang={lang} back="/" />
        );
    }
}

export default Disclaimer;
