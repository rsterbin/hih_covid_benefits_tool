import React, { Component } from 'react';

import Intro from '../../components/Intro/Intro';
import Question from '../../components/Question/Question';
import Response from '../../components/Response/Response';

import './Quiz.css';

class Quiz extends Component {

    state = {
        started: false,
        completed: false,
        answers: {},
        step: null
    };

    questions = {
        order: [ 'type', 'books', 'status', 'hoursperweek', 'length', 'hoursperyear', 'havework', 'selfcovid', 'othercovid', 'children' ],
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
            selfcovid: {
                q: 'Has your employee needed to go into quarantine due to known or suspected COVID-19?',
                a: {
                    A: 'Yes',
                    B: 'No'
                }
            },
            othercovid: {
                q: 'Has your employee needed to care for a member of their household due to known or suspected COVID-19?',
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

    responses = [
        {
            conditions: {
                status: 'A|B',
                hoursperweek: 'B',
                durationok: 'Y',
                havework: 'A',
                selfcovid: 'A',
                othercovid: 'B',
                children: 'B'
            },
            text: [
                'Your {{employee_type}} is eligible for two days of paid leave under NYS Paid Safe and Sick Leave, two under the NYS DWBOR Paid Days of Rest, and a maximum of 80 under FFCRA Paid Sick Leave. (Not sure if these stack -- are they eligible for 4 days of their regular hours, plus 80, or two days total?)',
                'If you were to terminate your {{employee_type}}, they would be eligible for up to 39 weeks of unemployment.  This would provide $XXX-$YYY per week.  We usually recommend this as a fallback position if your own income shrinks to the point that paying your {{employee_type}} is no longer possible.'
            ]
        },
        {
            conditions: {
                status: 'A|B',
                hoursperweek: 'C',
                durationok: 'Y',
                havework: 'A',
                selfcovid: 'A',
                othercovid: 'B',
                children: 'B'
            },
            text: [
                'Your {{employee_type}} is eligible for two days of paid leave under NYS Paid Safe and Sick Leave, three under the NYS DWBOR Paid Days of Rest, and a maximum of 80 under FFCRA Paid Sick Leave. (Not sure if these stack -- are they eligible for 5 days of their regular hours, plus 80, or three days total?)',
                'If you were to terminate your {{employee_type}}, they would be eligible for up to 39 weeks of unemployment.  This would provide $XXX-$YYY per week.  We usually recommend this as a fallback position if your own income shrinks to the point that paying your {{employee_type}} is no longer possible.'
            ]
        }
    ];

    defaultResponseText = [
        'Here is the response that we show when we don\'t have something already written up!'
    ];

    booksResponseText = [
        'Because you pay off the books, you may be responsible for certain fees and back taxes should your {{employee_type}} claim the benefits they’re entitled to.  We recommend that you work with X company to get on the books, or contact a professional with experience in this area.'
    ];

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

        // Default to the intro
        let body = <Intro clicked={this.startQuiz} />;

        // If we're done, find the response
        if (this.state.completed) {
            let template = this.defaultResponseText;

            // Build the answer key
            let answerKey = {};
            for (const q of ['hoursperweek', 'havework', 'selfcovid', 'othercovid', 'children']) {
                answerKey[q] = this.state.answers[q];
            }
            if (this.state.answers.status === 'A' || this.state.answers.status === 'B') {
                answerKey.status = 'A|B';
            } else {
                answerKey.status = this.state.answers.status;
            }
            if (this.state.answers.length === 'B' || this.state.answers.hoursperyear === 'B') {
                answerKey.durationok = 'Y';
            } else {
                answerKey.durationok = 'N';
            }

            // Check it against each response to find the correct one
            for (const r of this.responses) {
                let match = true;
                for (const c of Object.keys(r.conditions)) {
                    if (answerKey[c] !== r.conditions[c]) {
                        match = false;
                    }
                }
                if (match) {
                    template = r.text;
                    break;
                }
            }

            // Add the off-the-books tag if necessary
            if (this.state.answers.books === 'B') {
                template.push(this.booksResponseText);
            }

            // Sub in the employee type
            let employeeType = 'employee';
            if (this.state.answers.type === 'A') {
                employeeType = 'nanny';
            } else if (this.state.answers.type === 'B') {
                employeeType = 'house cleaner';
            } else if (this.state.answers.type === 'C') {
                employeeType = 'home care worker';
            }
            const finalAnswer = template.map((item) => {
                return item.replace(/\{\{employee_type\}\}/g, employeeType);
            });

            // Show the response
            body = <Response
                answerParas={finalAnswer}
                backClicked={this.goBack}
                restartClicked={this.startQuiz} />;

        // Otherwise, show a question
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
