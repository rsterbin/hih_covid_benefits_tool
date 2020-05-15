import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Intro from '../../../components/BenefitsTool/Intro/Intro';
import Language from '../../../utils/Language';

class Landing extends Component {

    state = {
        loaded_lang: false
    };

    lang = null;

    startQuiz = () => {
        this.props.clearAnswers();
        this.props.history.push('/quiz');
    };

    componentDidMount() {
        this.lang = {
            header: Language.get('landing_header'),
            message: Language.get('landing_message')
        };
        this.setState({ loaded_lang: true });
    }

    render() {
        if (!this.state.loaded_lang) {
            return <Spinner />;
        }
        return <Intro clicked={this.startQuiz} lang={this.lang} />;
    }
}

export default withRouter(Landing);
