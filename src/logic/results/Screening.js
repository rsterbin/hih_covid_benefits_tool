
import ConditionsData from '../../data/conditions.json';

class Screening {

    conditions = ConditionsData;

    firstPass = {

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

        // The hours-worked requirements for NYS are simple for domestic workers
        // employed directly, but complicated for agencies, so we want to
        // collapse this to something simple rather than checking agency vs not
        // AND the time requirements.  The options are:
        // * agency + any [A]
        // * non-agency + 40+/week + 6+ months [E]
        // * non-agency + anything else [N]
        workForNYS: (answers, key) => {
            if (answers['agency'] === 'A') {
                return 'A';
            }
            if (
                answers['hours per week'] === 'B' &&
                (
                    answers['length of employment'] === 'B' ||
                    answers['length of employment'] === 'C'
                )
            ) {
                return 'Y';
            } else {
                return 'N';
            }
        },

        // For FFCRA, reasons break down as--
        // * self-quarantine + school closed + any [B]
        // * self-quarantine + any (but not school closed) [Q]
        // * school closed + any (but not self-quarantine) [S]
        // * family quarantine and/or stay at home [F]
        // * none [N]
        // * unhandled case [U] (shouldn't happen)
        findReasonForFFCRA: (answers, key, rolling) => {
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
        // * self-quarantine + any [Q]
        // * family quarantine + any [F]
        // * any combination of the other options [N]
        // * unhandled case [U] (shouldn't happen)
        findReasonForNYS: (answers, key, rolling) => {
            if (answers['self-quarantine'] === 'A') {
                return 'Q';
            }
            if (answers['family quarantine'] === 'A') {
                return 'F';
            }
            if (
                answers['self-quarantine'] === 'B' &&
                answers['family quarantine'] === 'B'
            ) {
                return 'N';
            }
            return 'U';
        }

    };

    secondPass = {
        simple: (answers, key, eligibility) => {
            if (key in eligibility) {
                return 'Y';
            }
            return 'N';
        }
    };

    runFirstPass(answerKey) {
        let byBenefit = {};
        for (const benefit in this.conditions) {
            let scenario = {};
            for (const cond of this.conditions[benefit]) {
                if (cond.pass !== 'first') {
                    continue;
                }
                let k = cond.code;
                let m = cond.method;
                scenario[k] = this.firstPass[m](answerKey, k);
            }
            byBenefit[benefit] = scenario;
        }
        return byBenefit;
    }

    runSecondPass(answerKey, scenarios, eligibility) {
        let newScenarios = {};
        for (const benefit in this.conditions) {
            let scenario = scenarios[benefit];
            for (const cond of this.conditions[benefit]) {
                if (cond.pass !== 'second') {
                    continue;
                }
                let k = cond.code;
                let m = cond.method;
                scenario[k] = this.secondPass[m](answerKey, k, eligibility);
            }
            newScenarios[benefit] = scenario;
        }
        return newScenarios;
    }

}

export default new Screening();
