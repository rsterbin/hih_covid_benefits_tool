import React, { Component } from 'react';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Basic from '../../../components/BenefitsTool/Basic/Basic';
import Language from '../../../utils/Language';
import Logger from '../../../utils/Logger';

class Disclaimer extends Component {

    state = {
        loaded_lang: false
    };

    lang = null;

    componentDidMount() {
        Logger.setComponent('BenefitsTool/Disclaimer');
        this.lang = {
            header: Language.get('disclaimer_header'),
            body: Language.get('disclaimer_text'),
            back_link: Language.get('util_back_to_quiz'),
            back_title: Language.get('util_back_to_quiz')
        };
        this.setState({ loaded_lang: true });
    }

    render() {
        Logger.setComponent('BenefitsTool/Disclaimer');
        if (!this.state.loaded_lang) {
            return <Spinner />;
        }
        return (
            <Basic lang={this.lang} back="/" />
        );
    }
}

export default Disclaimer;
