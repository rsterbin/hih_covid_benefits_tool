import React, { Component } from 'react';

import Intro from '../../components/Intro/Intro';
import Question from '../../components/Question/Question';
import Response from '../../components/Response/Response';

import './Quiz.css';

class Quiz extends Component {

    questions = {
        order: [ 'type', 'books', 'status', 'hoursperweek', 'length', 'hoursperyear', 'havework', 'illness', 'children' ],
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
            },
            hoursperweek: {
                q: 'How many hours per week did your employee work before the stay-at-home order?',
                a: {
                    A: 'Under 20',
                    B: '20-29',
                    C: '30-39',
                    D: 'Over 40'
                }
            },
            length: {
                q: 'How long has your employee worked for you?',
                a: {
                    A: 'Less than one year',
                    B: 'One year or more'
                }
            },
            hoursperyear: {
                q: 'In that time, how many hours did they work (per year, if more than one)?',
                a: {
                    A: 'Under 80',
                    B: '80 or more'
                }
            },
            havework: {
                q: 'Do you have work for your employee but can’t have them come in because of the stay-at-home order?',
                a: {
                    A: 'Yes',
                    B: 'No'
                }
            },
            illness: {
                q: 'Has your employee needed to go into quarantine, or to care for a member of their household, due to known or suspected COVID-19?',
                a: {
                    A: 'Yes',
                    B: 'No'
                }
            },
            children: {
                q: 'Does your employee have children whose school has been closed?',
                a: {
                    A: 'Yes',
                    B: 'No'
                }
            }
        }
    };

    state = {
        started: false,
        completed: false,
        answers: {},
        step: null
    };

    startQuiz = () => {
        this.setState({ started: true, step: 0, completed: false, answers: {} });
    };

    clickAnswer = (aKey) => {
        let newAnswers = { ...this.state.answers };
        newAnswers[this.questions.order[this.state.step]] = aKey;
        let newStep = this.state.step + 1;
        if (newStep < this.questions.order.length) {
            this.setState({ answers: newAnswers, step: newStep });
        } else {
            this.setState({ answers: newAnswers, step: null, completed: true });
        }
    };

    goBack = () => {
        console.log(this.state.answers);
        if (this.state.completed) {
            this.setState({ step: this.questions.order.length - 1, completed: false });
        } else if (this.state.started) {
            let newStep = this.state.step - 1;
            if (newStep < 0) {
                this.setState({ step: null, started: false });
            } else {
                this.setState({ step: newStep });
            }
        }
    };

    render() {

        let body = <Intro clicked={this.startQuiz} />;
        if (this.state.completed) {
            body = <Response
                answers={this.state.answers}
                backClicked={this.goBack}
                restartClicked={this.startQuiz} />;
        } else if (this.state.started) {
            let question = this.questions.order[this.state.step];
            if (typeof question == 'string') {
                const q = this.questions.spec[question].q;
                const a = Object.keys(this.questions.spec[question].a)
                    .map((aKey) => {
                        let selected = false;
                        if (typeof this.state.answers[question] != 'undefined') {
                            if (this.state.answers[question] === aKey) {
                                selected = true;
                            }
                        }
                        return {
                            value: aKey,
                            text: this.questions.spec[question].a[aKey],
                            selected: selected,
                            clicked: () => { this.clickAnswer(aKey); }
                        };
                    });
                body = (
                    <Question questionText={q} answers={a} stepCount={this.questions.order.length} step={this.state.step} backClicked={this.goBack} />
                );
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
