import React, { Component } from 'react';

import Intro from '../../components/Intro/Intro';
import Question from '../../components/Question/Question';
import Confirmation from '../../components/Confirmation/Confirmation';
import Response from '../../components/Response/Response';

import QuestionsData from '../../data/questions.json';
import BenefitsData from '../../data/benefits.json';
import ResponsesData from '../../data/responses.json';

import './Quiz.css';

class Quiz extends Component {

    state = {
        started: false,
        completed: false,
        confirmed: false, 
        answers: {},
        step: null
    };

    questions = QuestionsData;
    benefits = BenefitsData;
    responses = ResponsesData;

    // This will be loaded when it's needed
    benefitResponses = null;

    customAnswers = {
        splitTypeByEssential: (answers) => {
            if (answers.type === 'D') {
                return 'E';
            } else {
                return 'N';
            }
        },

        splitTypeByHomeCare: (answers) => {
            if (answers.type === 'C' || answers.type === 'D') {
                return 'H';
            } else {
                return 'N';
            }
        },

        splitBooksByTaxes: (answers) => {
            if (answers.books === 'A' || answers.books === 'B') {
                return 'Y';
            } else {
                return 'N';
            }
        },

        splitBooksByCompliance: (answers) => {
            if (answers.books === 'A') {
                return 'C';
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
        },

        // For NYS, reasons break down as--
        // * self-quarantine or family quarantine + any [Q]
        // * school closed (but not either quarantine) + any [Q]
        // * none [N]
        // * unhandled case [U] (shouldn't happen)
        findReasonForNYS: (answers) => {
            if (
                answers['self-quarantine'] === 'A' ||
                answers['family quarantine'] === 'A'
            ) {
                return 'Q';
            }
            if (answers['school closed'] === 'A') {
                return 'S';
            }
            if (
                answers['self-quarantine'] === 'B' &&
                answers['family quarantine'] === 'B' &&
                answers['school closed'] === 'B'
            ) {
                return 'N';
            }
            return 'U';
        },

    };

    startQuiz = () => {
        this.setState({ started: true, step: 0, completed: false, confirmed: false, answers: {} });
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
        if (this.state.confirmed) {
            // Nope! We already sent over your info
            return;
        }
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
        if (this.state.confirmed) {
            // Nope! We already sent over your info
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

    confirmAnswers = () => {
        if (this.state.confirmed) {
            // Nope! Already done
            return;
        }
        if (!this.state.completed || !this.state.started) {
            // That's weird, try again
            return;
        }
        this.setState({ confirmed: true });
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

    loadBenefitResponses() {
        let responses = {};
        for (const benefit of this.benefits.order) {
            let r = null;
            try {
                r = require('../../data/benefits/' + benefit + '.json');
            } catch {
                r = null;
            }
            if (r) {
                responses[benefit] = r;
            } else {
                responses[benefit] = [];
            }
        }
        this.benefitResponses = responses;
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

        // Load the benefit responses
        if (this.benefitResponses === null) {
            this.loadBenefitResponses();
        }

        // For each benefit, see if we have any text to add
        for (const b of this.benefits.order) {
            let template = [];

            // Build the answer key
            let answerKey = this.buildAnswerKey(b);

            // Loop through and check for a matching response
            for (const r of this.benefitResponses[b]) {
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

        if (sections.length < 1) {
            // Set the default text if we don't have anything to show
            sections.push({
                header: '',
                text: this.replaceEmployeeType(this.responses.defaultNoBenefits)
            });
        } else {
            // Or add the intro text if we do
            sections.unshift({
                header: '',
                text: this.replaceEmployeeType(this.responses.introWithBenefits)
            });
        }

        // Add the retaliation tag
        sections.push({
            header: 'Warning',
            text: this.replaceEmployeeType(this.responses.retaliationWarning)
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
        if (this.state.confirmed) {
            const finalAnswer = this.getFinalAnswer();
            body = <Response
                header={this.replaceEmployeeType(this.responses.standardHeader)}
                answerSections={finalAnswer.sections}
                resources={finalAnswer.resources}
                restartClicked={this.startQuiz} />;

        // If we're done answering questions, show a confirm
        } else if (this.state.completed) {
            body = <Confirmation
                questions={this.questions}
                answers={this.state.answers}
                backClicked={this.goBack}
                forwardClicked={this.confirmAnswers} />;

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
