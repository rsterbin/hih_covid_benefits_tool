import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Intro from '../../../components/BenefitsTool/Intro/Intro';
import Language from '../../../utils/Language';
import Api from '../../../storage/Api';
import Logger from '../../../utils/Logger';

class Landing extends Component {

    state = {
        loaded_lang: false,
        error: false
    };

    lang = null;

    startQuiz = () => {
        this.setState({ error: false });
        Api.bumpSession(this.props.visitor_id, () => {
                this.goToQuiz();
            },
            () => {
                this.errorOrMoveOn();
            });
    };

    errorOrMoveOn() {
        // These are alert-level errors for me the programmer, but not
        // for the user -- if the API is malfunctioning, let's give it
        // one chance to get over a hiccup, then send them on to the
        // quiz page without getting a token to record their answers
        this.setState((current) => {
            if (current.error) {
                this.goToQuiz();
                return { error: false };
            } else {
                return { error: true };
            }
        });
    }

    goToQuiz() {
        this.setState({ error: false }, () => {
            this.props.clearAnswers();
            this.props.history.push('/quiz');
        });
    }

    componentDidMount() {
        Logger.setComponent('BenefitsTool/Landing');
        this.lang = {
            header: Language.get('landing_header'),
            message: Language.get('landing_message'),
            error_msg: Language.get('landing_error'),
            disclaimer_link: Language.get('landing_disclaimer_link'),
            disclaimer_title: Language.get('landing_disclaimer_title')
        };
        this.setState({ loaded_lang: true });
    }

    render() {
        Logger.setComponent('BenefitsTool/Landing');
        if (!this.state.loaded_lang) {
            return <Spinner />;
        }
        return <Intro
            error={this.state.error ? this.lang.error_msg : null}
            clicked={this.startQuiz}
            lang={this.lang} />;
    }
}

export default withRouter(Landing);
