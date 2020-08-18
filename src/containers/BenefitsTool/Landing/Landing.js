import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Intro from '../../../components/BenefitsTool/Intro/Intro';
import Language from '../../../utils/Language';
import Api from '../../../storage/Api';
import Logger from '../../../utils/Logger';
import * as actions from '../../../storage/redux/actions/index';

class Landing extends Component {

    state = {
        error: false
    };

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
    }

    render() {
        Logger.setComponent('BenefitsTool/Landing');
        const lang = {
            header: Language.get('landing_header'),
            message: Language.get('landing_message'),
            error_msg: Language.get('landing_error'),
            disclaimer_link: Language.get('landing_disclaimer_link'),
            disclaimer_title: Language.get('landing_disclaimer_title')
        };

        return <Intro
            error={this.state.error ? lang.error_msg : null}
            clicked={this.startQuiz}
            lang={lang} />;
    }
}

const mapStateToProps = state => {
    return {
        visitor_id: state.visitor_id
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearAnswers: () => dispatch(actions.answersClear())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
