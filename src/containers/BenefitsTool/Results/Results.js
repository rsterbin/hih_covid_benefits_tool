import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import Response from '../../../components/BenefitsTool/Response/Response';
import Controls from '../../../components/UI/Controls/Controls';

import BenefitsData from '../../../data/benefits.json';
import ResponsesData from '../../../data/responses.json';

// TODO: rename responses data to something like language
// TODO: add all other text

class Results extends Component {

    responses = ResponsesData;

    // This will be loaded on mount
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

    loadBenefitResponses() {
        let responses = {};
        for (const benefit of BenefitsData.order) {
            let r = null;
            try {
                r = require('../../../data/benefits/' + benefit + '.json');
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
        for (const q of BenefitsData.spec[benefit].conditions.simple) {
            answerKey[q] = this.props.answers[q];
        }
        for (const k of Object.keys(BenefitsData.spec[benefit].conditions.complex)) {
            let m = BenefitsData.spec[benefit].conditions.complex[k];
            answerKey[k] = this.customAnswers[m](this.props.answers);
        }
        return answerKey;
    }

    replaceEmployeeType(template) {
        let employeeType = 'employee';
        if (this.props.answers.type === 'A') {
            employeeType = 'nanny';
        } else if (this.props.answers.type === 'B') {
            employeeType = 'house cleaner';
        } else if (this.props.answers.type === 'C') {
            employeeType = 'home attendant';
        } else if (this.props.answers.type === 'D') {
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
        if (this.benefitResponses === null) {
            this.loadBenefitResponses();
        }
        for (const b of BenefitsData.order) {
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
                    header: BenefitsData.spec[b].long,
                    text: this.replaceEmployeeType(template)
                });
                resources.push({
                    text: BenefitsData.spec[b].short,
                    title: BenefitsData.spec[b].long,
                    href: BenefitsData.spec[b].link
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
        const goto = this.props.needsRedirect();
        if (goto) {
            return <Redirect to={goto} />;
        }

        const header = this.replaceEmployeeType(this.responses.standardHeader);
        const finalAnswer = this.getFinalAnswer();
        const buttons = [
            {
                classNames: [ 'CTAButton' ],
                clicked: () => { window.open('https://domesticemployers.org/take-the-pledge/', '_blank'); },
                text: 'Take the Pledge'
            },
            {
                classNames: [ 'CTAButton' ],
                text: 'CTA Button #2'
            },
            {
                classNames: [ 'CTAButton' ],
                text: 'CTA Button #3'
            }
        ];
        const links = [
            {
                classNames: [ 'RestartLink' ],
                clicked: () => { this.props.history.push('/') },
                text: 'restart quiz'
            }
        ];

        return (
            <div className="Results">
                <Response
                    header={header}
                    answerSections={finalAnswer.sections}
                    resources={finalAnswer.resources} />
                <Controls
                    buttons={buttons}
                    links={links} />
            </div>
        );
    }

}

export default withRouter(Results);
