
import ConditionsData from '../../data/conditions.json';

class Screening {

    conditions = ConditionsData;

    processAnswers = {

        simple: (answers, key) => {
            return answers[key];
        },

        splitTypeByEssential: (answers, key) => {
            if (answers.type === 'D') {
                return 'E';
            } else {
                return 'N';
            }
        },

        splitTypeByHomeCare: (answers, key) => {
            if (answers.type === 'C' || answers.type === 'D') {
                return 'H';
            } else {
                return 'N';
            }
        },

        splitBooksByTaxes: (answers, key) => {
            if (answers.books === 'A' || answers.books === 'B') {
                return 'Y';
            } else {
                return 'N';
            }
        },

        splitBooksByCompliance: (answers, key) => {
            if (answers.books === 'A') {
                return 'C';
            } else {
                return 'N';
            }
        },

        splitLengthByYear: (answers, key) => {
            if (answers['length of employment'] === 'C') {
                return 'O';
            } else {
                return 'U';
            }
        },

        splitLengthByMonths: (answers, key) => {
            if (answers['length of employment'] === 'A') {
                return 'U';
            } else {
                return 'O';
            }
        },

        employedByYearAndHours: (answers, key) => {
            if (answers['length of employment'] === 'C'
                && answers['hours per year'] === 'B') {
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
        findReasonForFFCRA: (answers, key) => {
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
        findReasonForNYS: (answers, key) => {
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
        for (const benefit in this.conditions) {
            let scenario = {};
            for (const k in this.conditions[benefit]) {
                let m = this.conditions[benefit][k];
                scenario[k] = this.processAnswers[m](answerKey, k);
            }
            byBenefit[benefit] = scenario;
        }
        return byBenefit;
    }

}

export default new Screening();
