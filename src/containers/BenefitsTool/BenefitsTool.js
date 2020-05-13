import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Quiz from './Quiz/Quiz';
import Confirmation from './Confirmation/Confirmation';
import Results from './Results/Results';
import Intro from '../../components/BenefitsTool/Intro/Intro';
import AnswersCookie from '../../storage/cookies/FlagsCookie';
import FlagsCookie from '../../storage/cookies/FlagsCookie';
import VisitorCookie from '../../storage/cookies/VisitorCookie';

import QuestionsData from '../../data/questions.json';

// TODO: Add routing for tool flow
// TODO: Social icons in the footer
// TODO: Add catch for {{link text|link url}} to the text processing

class BenefitsTool extends Component {

    state = {
        visitor_id: null,
        started: false,
        completed: false,
        confirmed: false, 
        answers: {}
    };

    flags = [ 'started', 'completed', 'confirmed' ];

    questions = QuestionsData;

    componentDidMount() {
        let newstate = {};
        let visitor_id = VisitorCookie.get();
        if (!visitor_id) {
            visitor_id = uuidv4();
            VisitorCookie.set(visitor_id);
        }
        newstate.visitor_id = visitor_id;

        newstate.answers = {};
        let sess_answers = AnswersCookie.get();
        if (sess_answers) {
            for (const sess_question in sess_answers) {
                if (sess_question in this.questions.spec) {
                    const sess_answer = sess_answers[sess_question];
                    if (sess_answer in this.questions.spec[sess_question].a) {
                        newstate.answers[sess_question] = sess_answer;
                    }
                }
            }
        }

        let flags = FlagsCookie.get();
        if (flags) {
            for (const flag of this.flags) {
                if (flags[flag]) {
                    newstate[flag] = true;
                }
            }
        }

        this.setState(newstate);
    }

    updateSession(newstate) {
        this.setState(newstate);
        if ('answers' in newstate) {
            AnswersCookie.set(newstate.answers);
        }
        let flags = {};
        for (const k of this.flags) {
            if (k in newstate) {
                flags[k] = newstate[k];
            } else {
                flags[k] = this.state[k];
            }
        }
        if (Object.keys(flags).length > 0) {
            FlagsCookie.set(flags);
        }
    }

    startQuiz = () => {
        this.updateSession({ 
            started: true,
            answers: {}
        });
    };

    editAnswer = (qcode, letter, completed) => {
        let newAnswers = { ...this.state.answers };
        if (typeof this.questions.spec[qcode] === 'undefined' ||
            typeof this.questions.spec[qcode].a[letter] === 'undefined') {
            return;
        }
        newAnswers[qcode] = letter;
        let newstate = { answers: newAnswers };
        if (completed) {
            newstate.completed = true;
        }
        this.updateSession(newstate);
    };

    restartQuiz = () => {
        this.updateSession({ 
            started: false,
            completed: false,
            confirmed: false,
            answers: {}
        });
    };

    confirmAnswers = () => {
        this.updateSession({ 
            confirmed: true
        });
    };

    render() {

        // Default to the intro
        let body = <Intro clicked={this.startQuiz} />;

        // If we're done, find the response
        if (this.state.confirmed) {
            body = <Results
                answers={this.state.answers}
                restartQuiz={this.restartQuiz} />;

        // If we're done answering questions, show a confirm
        } else if (this.state.completed) {
            body = <Confirmation
                visitor_id={this.state.visitor_id}
                answers={this.state.answers}
                confirmAnswers={this.confirmAnswers}
                editAnswer={this.editAnswer}
                restartQuiz={this.restartQuiz} />;

        // Otherwise, show the quiz
        } else if (this.state.started) {
            body = <Quiz
                answers={this.state.answers}
                editAnswer={this.editAnswer}
                restartQuiz={this.restartQuiz} />
        }

        return (
            <div className="BenefitsTool">
                {body}
            </div>
        );
    }

}

export default BenefitsTool;
