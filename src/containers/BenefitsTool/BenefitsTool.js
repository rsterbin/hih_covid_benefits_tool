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

import QuestionsData from '../../data/questions.json';

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
        newstate.answers = {};
        let sess_answers = AnswersCookie.get();
        if (sess_answers) {
            for (const sess_question in sess_answers) {
                if (sess_question in QuestionsData.spec) {
                    const sess_answer = sess_answers[sess_question];
                    if (sess_answer in QuestionsData.spec[sess_question].a) {
                        newstate.answers[sess_question] = sess_answer;
                    }
                }
            }
        }

        newstate.loaded = true;
        this.setState(newstate);
    }

    clearAnswers = () => {
        AnswersCookie.set({});
        this.setState({ answers: {} });
    }

    saveAnswer = (qcode, letter, completed) => {
        let newAnswers = { ...this.state.answers };
        if (typeof QuestionsData.spec[qcode] === 'undefined' ||
            typeof QuestionsData.spec[qcode].a[letter] === 'undefined') {
            return false;
        }
        newAnswers[qcode] = letter;
        AnswersCookie.set(newAnswers);
        this.setState({ answers: newAnswers });
        return true;
    };

    answersComplete() {
        for (const qcode of Object.keys(QuestionsData.order)) {
            if (typeof this.state.answers[qcode] === 'undefined') {
                return false;
            }
            const letter = this.state.answers[qcode];
            if (typeof QuestionsData.spec[qcode].a[letter] === 'undefined') {
                return false;
            }
        }
        return true;
    }

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
            saveAnswer={this.saveAnswer} />;

        const doResults = () => <Results
            answers={this.state.answers} />;

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
