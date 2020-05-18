
import Questions from '../Questions';
import Language from '../../utils/Language';

class ProcessText {

    type_answer = null;
    type_replacement = null;

    setEmployeeType(typeAnswer) {
        this.type_answer = typeAnswer;
    }

    findTypeReplacement() {
        let r = Language.get('results_employee_type_unknown');
        const letters = Questions.getAnswerLetters('type');
        if (letters.includes(this.type_answer)) {
            let k = 'results_employee_type_' + this.type_answer.toLowerCase();
            let f = Language.get(k);
            if (f) {
                r = f;
            }
        }
        this.type_replacement = r;
    }

    replaceEmployeeType(text) {
        if (this.type_replacement === null) {
            this.findTypeReplacement();
        }
        return text.replace(/\{\{employee_type\}\}/g, this.type_replacement);
    }

    process(result_key) {
        return Language.get(result_key, t => {
            return this.replaceEmployeeType(t);
        });
    }

}

export default new ProcessText();
