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

    benefits = {
        order: ['ffcra', 'nys', 'dwbor', 'cares'],
        spec: {
            ffcra: {
                long: 'Families First Coronavirus Response Act',
                short: 'FFCRA',
                link: 'http://www.example.com',
                conditions: {
                    simple: [ 'agency', 'books' ],
                    complex: {
                        'type': 'splitTypeByEssential',
                        'reason': 'findReasonForFFCRA'
                    }
                }
            },
            nys: {
                long: 'New York State Sick Days, Paid Family Leave and Disability',
                short: 'NYS Sick Days, PFL and DB',
                link: 'http://www.example.com',
                conditions: {
                    simple: [ 'agency', 'books', 'hours per week',
                        'hours per year', 'self-quarantine',
                        'family quarantine', 'school closed' ],
                    complex: {
                        'type': 'splitTypeByEssential',
                        'length of employment': 'splitLengthByYear'
                    }
                }
            },
            dwbor: {
                long: 'New York City Paid Safe and Sick Leave / New York State Domestic Worker Bill of Rights',
                short: 'NYC PSSL / NYS DWBoR',
                link: 'http://www.example.com',
                conditions: {
                    simple: [ 'hours per week', 'hours per year' ],
                    complex: {
                        'type' : 'splitTypeByEssential',
                        'length of employment' : 'splitLengthByYear'
                    }
                }
            },
            cares: {
                long: 'Coronavirus Aid, Relief, and Economic Security Act Unemployment Benefits',
                short: 'CARES UI Benefits',
                link: 'http://www.example.com',
                conditions: {
                    simple: [ 'books' ],
                    complex: {
                        'type': 'splitTypeByEssential',
                        'length of employment': 'splitLengthByMonths'
                    }
                }
            }
        }
    };

    // TODO: move responses to csv
    responses = {
        ffcra: [
            {
                conditions: {
                    'type': 'N',
                    'agency': 'B',
                    'books': 'A',
                    'reason': 'B',
                },
                text: [
                    'Your {{employee_type}} qualifies for paid sick leave under the Family First Coronavirus Response Act (FFCRA) Emergency Paid Sick Leave Act, to a maximum of 80 hours, at their regular rate. This benefit does not have any immigration status or minimum work requirements. Employers are responsible for up-front payment, but a tax credit might be available. Please contact your accountant to ask if you qualify. These provisions last until Dec. 31, 2020.',
                    'Your {{employee_type}} also qualifies for paid family and medical leave under the FFCRA Emergency Family and Medical Leave Expansion Act. This lasts for up to 12 weeks: the first two weeks are unpaid, and the rest should be at 2/3 their regular rate. To be eligible, your {{employee_type}} must have been employed for at least 30 days.'
                ]
            },
            {
                conditions: {
                    'type': 'N',
                    'agency': 'B',
                    'books': 'A',
                    'reason': 'Q',
                },
                text: [
                    'Your {{employee_type}} qualifies for paid sick leave under the Family First Coronavirus Response Act (FFCRA) Emergency Paid Sick Leave Act, to a maximum of 80 hours, at their regular rate. This benefit does not have any immigration status requirements. Employers are responsible for up-front payment, but a tax credit might be available. Please contact your accountant to ask if you qualify. These provisions last until Dec. 31, 2020.'
                ]
            },
            {
                conditions: {
                    'type': 'N',
                    'agency': 'B',
                    'books': 'A',
                    'reasons': 'S',
                },
                text: [
                    'Your {{employee_type}} qualifies for paid sick leave under the Family First Coronavirus Response Act (FFCRA) Emergency Paid Sick Leave Act, to a maximum of 80 hours, at 2/3 their regular rate. This benefit does not have any immigration status or minimum work  requirements. Employers are responsible for up-front payment, but a tax credit might be available. Please contact your accountant to ask if you qualify. These provisions last until Dec. 31, 2020.',
                    'Your {{employee_type}} also qualifies for paid family and medical leave under the FFCRA Emergency Family and Medical Leave Expansion Act. This lasts for up to 12 weeks: the first two weeks are unpaid, and the rest should be at 2/3 their regular rate. To be eligible, your {{employee_type}} must have been employed for at least 30 days.'
                ]
            },
            {
                conditions: {
                    'type': 'N',
                    'agency': 'B',
                    'books': 'A',
                    'reason': 'F',
                },
                text: [
                    'Your {{employee_type}} qualifies for paid sick leave under the Family First Coronavirus Response Act (FFCRA) Emergency Paid Sick Leave Act, to a maximum of 80 hours, at 2/3 their regular rate. This benefit does not have any immigration status requirements. Employers are responsible for up-front payment, but a tax credit might be available. Please contact your accountant to ask if you qualify. These provisions last until Dec. 31, 2020.',
                ]
            },
        ],
        nys: [],
        dwbor: [],
        cares: [
            {
                conditions: {
                    books: 'A'
                },
                text: [
                    'If you were to terminate your {{employee_type}}, they would be eligible for up to 39 weeks of unemployment.  This would provide $XXX-$YYY per week.  We usually recommend this as a fallback position if your own income shrinks to the point that paying your {{employee_type}} is no longer possible.'
                ]
            }
        ],
    };

    defaultResponseText = [
        'Here is the response that we show when we don\'t have something already written up!'
    ];

    retaliationResponseText = [
        'It is illegal to retaliate in any way if your {{employee_type}} tries to claim the benefits they’re entitled to.  We know that if you\'re using this tool, you want to do the right thing, but not every employer is like you!  It\'s important to be sure that when you discuss these benefits with your employee, you choose your words carefully so that they know you\'ll support them either way.'
    ];

    customAnswers = {
        splitTypeByEssential: (answers) => {
            if (answers.type === 'D') {
                return 'E';
            } else {
                return 'N';
            }
        },

        splitLengthByYear: (answers) => {
            if (answers['length of employment'] === 'C') {
                return 'O';
            } else {
                return 'U';
            }
        },

        splitLengthByMonths: (answers) => {
            if (answers['length of employment'] === 'A') {
                return 'U';
            } else {
                return 'O';
            }
        },

        // For FFCRA, reasons break down as--
        // * self-quarantine + school closed + any [B]
        // * self-quarantine + any (but not school closed) [Q]
        // * school closed + any (but not self-quarantine) [S]
        // * family quarantine and/or stay at home [F]
        // * none [N]
        // * unhandled case [U] (shouldn't happen)
        findReasonForFFCRA: (answers) => {
            if (
                answers['self-quarantine'] === 'A' &&
                answers['school closed'] === 'A'
            ) {
                return 'B';
            }
            if (answers['self-quarantine'] === 'A') {
                return 'Q';
            }
            if (answers['school closed'] === 'A') {
                return 'S';
            }
            if (
                answers['family quarantine'] === 'A' ||
                answers['stay at home'] === 'A'
            ) {
                return 'F';
            }
            if (
                answers['self-quarantine'] === 'B' &&
                answers['family quarantine'] === 'B' &&
                answers['stay at home'] === 'B' &&
                answers['school closed'] === 'B'
            ) {
                return 'N';
            }
            return 'U';
        }

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

    buildAnswerKey(benefit) {
        let answerKey = {};
        for (const q of this.benefits.spec[benefit].conditions.simple) {
            answerKey[q] = this.state.answers[q];
        }
        for (const k of Object.keys(this.benefits.spec[benefit].conditions.complex)) {
            let m = this.benefits.spec[benefit].conditions.complex[k];
            answerKey[k] = this.customAnswers[m](this.state.answers);
        }
        return answerKey;
    }

    replaceEmployeeType(template) {
        let employeeType = 'employee';
        if (this.state.answers.type === 'A') {
            employeeType = 'nanny';
        } else if (this.state.answers.type === 'B') {
            employeeType = 'house cleaner';
        } else if (this.state.answers.type === 'C') {
            employeeType = 'home attendant';
        } else if (this.state.answers.type === 'D') {
            employeeType = 'home health care worker';
        }
        return template.map((item) => {
            return item.replace(/\{\{employee_type\}\}/g, employeeType);
        });
    }

    getFinalAnswer() {
        let sections = [];
        let resources = [];

        // For each benefit, see if we have any text to add
        for (const b of this.benefits.order) {
            let template = [];

            // Build the answer key
            let answerKey = this.buildAnswerKey(b);

            // Loop through and check for a matching response
            for (const r of this.responses[b]) {
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

            // If we have something to send back, replace the employee type and add a section
            if (template.length > 0) {
                sections.push({
                    header: this.benefits.spec[b].long,
                    text: this.replaceEmployeeType(template)
                });
                resources.push({
                    text: this.benefits.spec[b].short,
                    title: this.benefits.spec[b].long,
                    href: this.benefits.spec[b].link
                });
            }
        }

        // Set the default text if we don't have anything to show
        if (sections.length < 1) {
            sections.push({
                header: '',
                text: this.replaceEmployeeType(this.defaultResponseText)
            });
        }

        // Add the retaliation tag
        sections.push({
            header: 'Warning',
            text: this.replaceEmployeeType(this.retaliationResponseText)
        });

        return {
            sections: sections,
            resources: resources
        };
    }

    render() {

        // Default to the intro
        let body = <Intro clicked={this.startQuiz} />;

        // If we're done, find the response
        if (this.state.completed) {
            const finalAnswer = this.getFinalAnswer();
            body = <Response
                answerSections={finalAnswer.sections}
                resources={finalAnswer.resources}
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
                        helpText={qspec.help}
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
