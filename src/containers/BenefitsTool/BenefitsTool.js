import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Landing from './Landing/Landing';
import Quiz from './Quiz/Quiz';
import Confirmation from './Confirmation/Confirmation';
import Results from './Results/Results';
import Logger from '../../utils/Logger';
import Questions from '../../logic/Questions';

import * as actionCreators from '../../storage/redux/actions/benefitsTool';

// TODO: Should we handle the Questions.validAnswer() check another way?

class BenefitsTool extends Component {

    componentDidMount() {
        this.props.load();
    }

    clearAnswers = () => {
        this.props.clearAnswers();
    }

    saveAnswer = (qcode, letter) => {
        if (!Questions.validAnswer(qcode, letter)) {
            Logger.warn('Request to save unknown question/answer pair', { qcode: qcode, letter: letter });
            return false;
        }
        this.props.saveAnswer(this.props.answers, qcode, letter);
        return true;
    };

    needsRedirect = () => {
        let ready = true;
        let started = false;
        let step = 0;
        for (const qcode of Questions.question_order) {
            if (typeof this.props.answers[qcode] === 'undefined') {
                Logger.debug('Needs redirect because of undefined question code ' + qcode, { answers: this.props.answers });
                ready = false;
                break;
            } else {
                started = true;
            }
            const letter = this.props.answers[qcode];
            if (!Questions.validAnswer(qcode, letter)) {
                Logger.warn('Needs redirect because of undefined answer letter ' + letter, { q_code: qcode, answers: this.props.answers });
                ready = false;
                break;
            }
            ++step;
        }
        if (!ready) {
            if (started) {
                return '/quiz/' + step;
            } else {
                return '/';
            }
        }
        return false;
    };

    render() {

        if (!this.props.loaded) {
            return <Spinner />;
        }

        const doQuiz = () => <Quiz
            visitor_id={this.props.visitor_id}
            answers={this.props.answers}
            saveAnswer={this.saveAnswer} />;

        const doConfirmation = () => <Confirmation
            visitor_id={this.props.visitor_id}
            answers={this.props.answers}
            needsRedirect={this.needsRedirect}
            saveAnswer={this.saveAnswer} />;

        const doResults = () => <Results
            answers={this.props.answers}
            needsRedirect={this.needsRedirect} />;

        const doLanding = () => <Landing
            visitor_id={this.props.visitor_id}
            clearAnswers={this.clearAnswers} />;

        return (
            <div className="BenefitsTool">
                <Switch>
                    <Route path="/quiz/:step" render={doQuiz} />
                    <Route path="/quiz" render={doQuiz} />
                    <Route path="/confirm" render={doConfirmation} />
                    <Route path="/results" render={doResults} />
                    <Route path="/" render={doLanding} />
                </Switch>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        visitor_id: state.benefits_tool.visitor_id,
        answers: state.benefits_tool.answers,
        started_load: state.benefits_tool.started_load,
        loaded: state.benefits_tool.loaded
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearAnswers: () => dispatch(actionCreators.requestClearAnswers()),
        saveAnswer: (a, q, l) => dispatch(actionCreators.requestSaveAnswer({answers: a, qcode: q, letter: l})),
        load: () => dispatch(actionCreators.startLoad()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BenefitsTool);
