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
        order: [ 'type', 'agency', 'books', 'hours per week', 'length of employment', 'hours per year', 'self-quarantine', 'family quarantine', 'stay at home', 'school closed' ],
        spec: {
            'type': {
                q: 'I employ a...',
                t: 'Employee Type',
                a: {
                    A: 'Nanny',
                    B: 'House Cleaner',
                    C: 'Home Attendant',
                    D: 'Home Health Care Worker'
                },
                layout: 'vert',
                help: 'If your home attendant provides any health care services, choose "HOME HEALTH CARE WORKER". If they do not provide any health care services, choose "HOME ATTENDANT".'
            },
            'agency': {
                q: 'Is your employee paid through an agency?',
                t: 'Agency',
                a: {
                    A: 'Yes',
                    B: 'No',
                },
                layout: 'horiz'
            },
            'books': {
                q: 'Are you paying your employee on the books?',
                t: 'On The Books',
                a: {
                    A: 'Yes, in compliance',
                    B: 'Yes, partially',
                    C: 'No'
                },
                layout: 'horiz',
                help: 'To be in compliance, you would need to have unemployment, disability, worker\'s compensation, and Paid Family Leave insurance in place, and pay taxes. If your employee does not qualify for disability, workers compensation or PFL, choose "YES, PARTIALLY".'
            },
            'hours per week': {
                q: 'How many hours per week did your employee work before the stay-at-home order?',
                t: 'Hours Per Week',
                a: {
                    A: 'Under 20',
                    B: '20-29',
                    C: '30-39',
                    D: 'Over 40'
                },
                layout: 'vert'
            },
            'length of employment': {
                q: 'How long has your employee worked for you?',
                t: 'Length of Employment',
                a: {
                    A: 'Less than six months',
                    B: 'Less than one year',
                    C: 'One year or more'
                },
                layout: 'horiz'
            },
            'hours per year': {
                q: 'In that time, how many hours did they work (per year, if more than one)?',
                t: 'Hours Per Year',
                a: {
                    A: 'Under 80',
                    B: '80 or more'
                },
                layout: 'horiz'
            },
            'self-quarantine': {
                q: 'Are they in quarantine because of known or suspected COVID-19?',
                t: 'Illness (Self)',
                a: {
                    A: 'Yes',
                    B: 'No'
                },
                layout: 'horiz'
            },
            'family quarantine': {
                q: 'Are they caring for a family member because of known or suspected COVID-19?',
                t: 'Illness (Family)',
                a: {
                    A: 'Yes',
                    B: 'No'
                },
                layout: 'horiz',
                help: 'Under NYC law, a family member is anyone you consider family.  Under NY state, a family member includes: "...".  Under federal law, family is not clearly defined. Answer YES if any of these apply.'
            },
            'stay at home': {
                q: 'Do you have work for your employee but can’t have them come in because of the stay-at-home order?',
                t: 'Stay-At-Home Order',
                a: {
                    A: 'Yes',
                    B: 'No'
                },
                layout: 'horiz'
            },
            'school closed': {
                q: 'Do they have children whose school or childcare has closed due to COVID-19?',
                t: 'School Closed',
                a: {
                    A: 'Yes',
                    B: 'No'
                },
                layout: 'horiz'
            }
        }
    };

    // TODO: move responses to csv
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

    goToStep = (stepNum) => {
        if (stepNum < 0 || stepNum >= this.questions.order.length) {
            return;
        }
        if (this.state.completed) {
            this.setState({ step: stepNum, completed: false });
        } else if (!this.state.started) {
            this.setState({ step: stepNum, started: true });
        } else {
            this.setState({ step: stepNum });
        }
    };

    getSteps() {
        let steps = [];
        const stepCount = this.questions.order.length;
        for (let i = 0; i < stepCount; ++i) {
            const qstep = this.questions.order[i];
            let step = {
                title: this.questions.spec[qstep].t,
                target: i,
            };
            if (this.state.step < i) {
                step.timeline = 'future';
            } else if (this.state.step === i) {
                step.timeline = 'present';
            } else {
                step.timeline = 'past';
            }
            if (typeof(this.state.answers[qstep]) !== 'undefined') {
                step.clicked = () => { this.goToStep(i); };
            }
            steps.push(step);
        }
        return steps;
    }

    buildAnswerKey() {
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
        return answerKey;
    }

    getFinalAnswer() {
        let template = this.defaultResponseText;

        // Build the answer key
        let answerKey = this.buildAnswerKey();

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
            for (const t of this.booksResponseText) {
                template.push(t);
            }
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
        return template.map((item) => {
            return item.replace(/\{\{employee_type\}\}/g, employeeType);
        });
    }

    render() {

        // Default to the intro
        let body = <Intro clicked={this.startQuiz} />;

        // If we're done, find the response
        if (this.state.completed) {
            const finalAnswer = this.getFinalAnswer();
            body = <Response
                answerParas={finalAnswer}
                backClicked={this.goBack}
                restartClicked={this.startQuiz} />;

        // Otherwise, show a question
        } else if (this.state.started) {
            let question = this.questions.order[this.state.step];
            if (typeof question == 'string') {
                const qspec = this.questions.spec[question];
                const aspec = Object.keys(qspec.a)
                    .map((aKey) => {
                        let selected = false;
                        if (typeof this.state.answers[question] != 'undefined') {
                            if (this.state.answers[question] === aKey) {
                                selected = true;
                            }
                        }
                        return {
                            value: aKey,
                            text: qspec.a[aKey],
                            selected: selected,
                            clicked: () => { this.clickAnswer(aKey); }
                        };
                    });
                const steps = this.getSteps();
                body = (
                    <Question
                        questionText={qspec.q}
                        answerLayout={qspec.layout}
                        answers={aspec}
                        steps={steps}
                        backClicked={this.goBack} />
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
