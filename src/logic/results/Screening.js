
class Screening {

    conditions = {
        ffcra: {
            simple: [ 'agency' ],
            complex: {
                type: 'splitTypeByEssential',
                books: 'splitBooksByTaxes',
                reason: 'findReasonForFFCRA'
            }
        },
        nys: {
            simple: [ 'agency', 'hours per week' ],
            complex: {
                books: 'splitBooksByCompliance',
                reason: 'findReasonForNYS'
            }
        },
        pssl: {
            simple: [ 'hours per year' ],
            complex: {
                type : 'splitTypeByHomeCare',
                'length of employment' : 'splitLengthByYear'
            }
        },
        dwbor: {
            simple: [],
            complex: {
                'length of employment' : 'splitLengthByYear'
            }
        },
        cares: {
            simple: [],
            complex: {
                books: 'splitBooksByCompliance',
                'length of employment': 'splitLengthByMonths'
            }
        }
    };

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
        }

    };

    getScenarios(answerKey) {
        let byBenefit = {};
        for (let benefit in this.conditions) {
            let scenario = {};
            for (const q of this.conditions[benefit].simple) {
                scenario[q] = answerKey[q];
            }
            for (let k in this.conditions[benefit].complex) {
                let m = this.conditions[benefit].complex[k];
                scenario[k] = this.customAnswers[m](answerKey);
            }
            byBenefit[benefit] = scenario;
        }
        return byBenefit;
    }

}

export default new Screening();
