
import Local, { Language } from '../utils/Language';

// NB: this class will build the questions data object in the
// current language -- if we do end up translating the tool, we'll
// need a different method to pull English for reporting

/* USES

src/containers/BenefitsTool/BenefitsTool.js
src/containers/BenefitsTool/Confirmation/Confirmation.js
src/containers/BenefitsTool/Confirmation/EditAnswers/EditAnswers.js
src/containers/BenefitsTool/Quiz/Quiz.js
src/storage/cookies/AnswersCookie.js

*/

class Questions {
    question_order = [
        'type', 'agency', 'books', 'hours per week',
        'length of employment', 'hours per year', 'self-quarantine',
        'family quarantine', 'stay at home', 'school closed'
    ];

    question_spec = {
        type: {
            answer_count: 4,
            layout: 'vert',
            help: true
        },
        agency: {
            answer_count: 2,
            layout: 'horiz',
            help: false
        },
        books: {
            answer_count: 3,
            layout: 'horiz',
            help: true
        },
        'hours per week': {
            answer_count: 2,
            layout: 'horiz',
            help: false
        },
        'length of employment': {
            answer_count: 3,
            layout: 'horiz',
            help: false
        },
        'hours per year': {
            answer_count: 2,
            layout: 'horiz',
            help: false
        },
        'self-quarantine': {
            answer_count: 2,
            layout: 'horiz',
            help: false
        },
        'family quarantine': {
            answer_count: 2,
            layout: 'horiz',
            help: true
        },
        'stay at home': {
            answer_count: 2,
            layout: 'horiz',
            help: false
        },
        'school closed': {
            answer_count: 2,
            layout: 'horiz',
            help: false
        }
    };

    localized_data = null;
    english_data = null;

    validAnswer(qcode, letter) {
        if (!letter || letter.length > 1) {
            return false;
        }
        if (qcode in this.question_spec) {
            const ascii = letter.charCodeAt(0);
            if (ascii < 65) {
                return false;
            }
            if (ascii > 65 + this.question_spec[qcode].answer_count - 1) {
                return false;
            }
            return true;
        }
        return false;
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
        const English = new Language('en');
        this.english_data = this.getData(English);
    }

    getData(LangObj) {
        let data = {};
        for (let name of this.question_order) {
            data[name] = {
                question: LangObj.get(this.lang_key(name, 'question')),
                title: LangObj.get(this.lang_key(name, 'short')),
                layout: this.question_spec[name].layout,
                answers: {}
            }
            for (let i = 0; i < this.question_spec[name].answer_count; ++i) {
                const lc = String.fromCharCode(97 + i);
                const uc = String.fromCharCode(65 + i);
                data[name].answers[uc] = LangObj.get(this.lang_key(name, 'answer_' + lc));
            }
            if (this.question_spec[name].help) {
                data[name].help = LangObj.get(this.lang_key(name, 'help'));
            }
        }
        return data;
    }

    lang_key(name, which) {
        return 'quiz_' + name.replace(/[^a-z]/g, '_') + '_' + which;
    }

}

export default new Questions();
