import React, { Component } from 'react';

import Intro from '../../components/Intro/Intro';
import Question from '../../components/Question/Question';
import Response from '../../components/Response/Response';

import './Quiz.css';

class Quiz extends Component {

    questions = {
        order: [ 'type', 'books', 'status' ],
        spec: {
            type: {
                q: 'I employ a...',
                a: {
                    A: 'Nanny',
                    B: 'House Cleaner',
                    C: 'Home Care Worker'
                }
            },
            books: {
                q: 'Are you paying your employee on the books?',
                a: {
                    A: 'Yes',
                    B: 'No'
                }
            },
            status: {
                q: 'What is your employee’s immigration status?',
                a: {
                    A: 'US Citizen / Green Card Holder / Permanent Resident',
                    B: 'DACA Recipient/ Work Permit',
                    C: 'Undocumented',
                    D: 'Don\'t Know'
                }
            }
        }
    }

    state = {
        started: false,
        completed: false,
        answers: {},
        step: null
    };

    startQuiz = () => {
        this.setState({ started: true, step: 0 });
    };

    clickAnswer = (aKey) => {
        let newAnswers = { ...this.state.answers };
        newAnswers[this.questions.order[this.step]] = aKey;
        let newStep = this.state.step + 1;
        if (newStep < this.questions.order.length) {
            this.setState({ answers: newAnswers, step: newStep });
        } else {
            this.setState({ answers: newAnswers, step: null, completed: true });
        }
    };

    render() {

        let body = <Intro clicked={this.startQuiz} />;
        if (this.state.completed) {
            body = <Response answers={this.state.answers} />;
        } else if (this.state.started) {
            let question = this.questions.order[this.state.step];
            if (typeof question == 'string') {
                const q = this.questions.spec[question].q;
                const a = Object.keys(this.questions.spec[question].a)
                    .map((aKey) => {
                        return {
                            value: aKey,
                            text: this.questions.spec[question].a[aKey],
                            clicked: () => { this.clickAnswer(aKey); }
                        };
                    });
                body = <Question questionText={q} answers={a} />;
            }
        }

        return (
            <div className="Quiz">
                {body}
            </div>
        );
    }
}

export default Quiz;
