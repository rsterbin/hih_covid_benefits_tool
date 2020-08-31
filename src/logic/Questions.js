
import Local, { Language } from '../utils/Language';
import Logger from '../utils/Logger';

import Data from '../data/questions.json';

class Questions {
    question_order = Data.order;

    localized_data = null;
    english_data = null;

    validAnswer(qcode, letter) {
        if (!(qcode in Data.spec)) {
            return false;
        }
        for (const answer of Data.spec[qcode].answers) {
            if (answer.letter === letter) {
                return true;
            }
        }
        return false;
    }

    getAnswerLetters(qcode) {
        if (!(qcode in Data.spec)) {
            return [];
        }
        let letters = [];
        for (const answer of Data.spec[qcode].answers) {
            letters.push(answer.letter);
        }
        return letters;
    }

    filterAnswers(answerKey) {
        let answers = {};
        for (const qcode of this.question_order) {
            if (this.validAnswer(qcode, answerKey[qcode])) {
                answers[qcode] = answerKey[qcode];
            }
        }
        return answers;
    }

    count() {
        return this.question_order.length;
    }

    getCodeByStep(step) {
        if (typeof this.question_order[step] === 'undefined') {
            return null;
        }
        return this.question_order[step];
    }

    // spec looks like this:
    // {
    //   q: the full question,
    //   t: the short title,
    //   a: the answers, as: {
    //     'A': the first answer,
    //     'B': the second answer, ... etc
    //   },
    //   layout: 'vert' or 'horiz',
    //   help: any help text (optional),
    // }
    getLocalSpec(qcode) {
        if (this.localized_data === null) {
            this.loadLocalizedData();
        }
        if (typeof this.localized_data[qcode] === 'undefined') {
            return null;
        }
        return this.localized_data[qcode];
    }

    getEnglishSpec(qcode) {
        if (this.english_data === null) {
            this.loadEnglishData();
        }
        if (typeof this.english_data[qcode] === 'undefined') {
            return null;
        }
        return this.english_data[qcode];
    }

    getEnglishAnswers(answerKey) {
        if (this.english_data === null) {
            this.loadEnglishData();
        }
        let english_answers = {};
        for (const qcode of this.question_order) {
            const letter = answerKey[qcode];
            const answer = this.english_data[qcode].answers[letter];
            english_answers[qcode] = answer.toUpperCase();
        }
        return english_answers;
    }

    getLocalConfirmation(answerKey) {
        if (this.localized_data === null) {
            this.loadLocalizedData();
        }
        let confirmation = [];
        for (const qcode of this.question_order) {
            const aspec = this.localized_data[qcode].answers;
            let answers = [];
            let selected = null;
            for (const letter of Object.keys(aspec).sort()) {
                let answer = {
                    letter: letter,
                    text: aspec[letter]
                };
                if (letter === answerKey[qcode]) {
                    selected = { ...answer };
                }
                answers.push(answer);
            }
            confirmation.push({
                code: qcode,
                text: this.localized_data[qcode].question,
                help: this.localized_data[qcode].help,
                layout: this.localized_data[qcode].layout,
                answers: answers,
                selected: selected
            });
        }
        return confirmation;
    }

    loadLocalizedData() {
        this.localized_data = this.getData(Local);
    }

    loadEnglishData() {
        if (Local.language_code === 'en') {
            if (this.localized_data === null) {
                this.loadLocalizedData();
            }
            this.english_data = this.localized_data;
        } else {
            const English = new Language('en');
            this.english_data = this.getData(English);
        }
    }

    getData(LangObj) {
        let data = {};
        for (let name of this.question_order) {
            data[name] = {
                question: LangObj.get(Data.spec[name].full_lang_key),
                title: LangObj.get(Data.spec[name].title_lang_key),
                layout: Data.spec[name].layout,
                answers: {}
            }
            for (const answer of Data.spec[name].answers) {
                data[name].answers[answer.letter] = LangObj.get(answer.lang_key);
            }
            if (Data.spec[name].help) {
                data[name].help = LangObj.get(Data.spec[name].help_lang_key);
            }
        }
        return data;
    }

    firstMissingStep(answers) {
        let ready = true;
        let started = false;
        let step = 0;
        for (const qcode of this.question_order) {
            if (typeof answers[qcode] === 'undefined') {
                Logger.debug('Missing step: undefined question code ' + qcode, { answers: answers });
                ready = false;
                break;
            } else {
                started = true;
            }
            const letter = answers[qcode];
            if (!this.validAnswer(qcode, letter)) {
                Logger.warn('Missing step: undefined answer letter ' + letter, { q_code: qcode, answers: answers });
                ready = false;
                break;
            }
            ++step;
        }
        if (!ready) {
            if (started) {
                return step;
            } else {
                return 0;
            }
        }
        return null;
    }

}

export default new Questions();
