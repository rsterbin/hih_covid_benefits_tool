import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Spinner from '../../components/UI/Spinner/Spinner';
import Landing from './Landing/Landing';
import Quiz from './Quiz/Quiz';
import Confirmation from './Confirmation/Confirmation';
import Results from './Results/Results';
import AnswersCookie from '../../storage/cookies/AnswersCookie';
import VisitorCookie from '../../storage/cookies/VisitorCookie';
import Logger from '../../utils/Logger';
import Questions from '../../logic/Questions';

// TODO: Language pull
// TODO: Social icons in the footer
// TODO: Add markdown processing

class BenefitsTool extends Component {

    state = {
        visitor_id: null,
        answers: {},
        loaded: false
    };

    componentDidMount() {
        let newstate = {};
        // Fetch visitor ID from the cookie
        let visitor_id = VisitorCookie.get();
        if (!visitor_id) {
            visitor_id = uuidv4();
            VisitorCookie.set(visitor_id);
        }
        newstate.visitor_id = visitor_id;
        // Fetch answers from the cookie
        newstate.answers = AnswersCookie.get() || {};
        // Mark this component loaded
        newstate.loaded = true;
        this.setState(newstate);
    }

    clearAnswers = () => {
        AnswersCookie.set({});
        this.setState({ answers: {} });
    }

    saveAnswer = (qcode, letter, completed) => {
        if (!Questions.validAnswer(qcode, letter)) {
            Logger.warn('Request to save unknown question/answer pair ' + qcode + '/' + letter);
            return false;
        }
        let newAnswers = { ...this.state.answers };
        newAnswers[qcode] = letter;
        AnswersCookie.set(newAnswers);
        this.setState({ answers: newAnswers });
        return true;
    };

    needsRedirect = () => {
        let ready = true;
        let started = false;
        let step = 0;
        for (const qcode of Questions.question_order) {
            if (typeof this.state.answers[qcode] === 'undefined') {
                Logger.debug('Needs redirect because of undefined question code ' + qcode, { answers: this.state.answers });
                ready = false;
                break;
            } else {
                started = true;
            }
            const letter = this.state.answers[qcode];
            if (!Questions.validAnswer(qcode, letter)) {
                Logger.warn('Needs redirect because of undefined answer letter ' + letter, { q_code: qcode, answers: this.state.answers });
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

        if (!this.state.loaded) {
            return <Spinner />;
        }

        const doQuiz = () => <Quiz
            answers={this.state.answers}
            saveAnswer={this.saveAnswer} />;

        const doConfirmation = () => <Confirmation
            visitor_id={this.state.visitor_id}
            answers={this.state.answers}
            needsRedirect={this.needsRedirect}
            saveAnswer={this.saveAnswer} />;

        const doResults = () => <Results
            answers={this.state.answers}
            needsRedirect={this.needsRedirect} />;

        const doLanding = () => <Landing
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

export default BenefitsTool;
