import React, { Component } from 'react';

import AnswerList from '../../../../components/BenefitsTool/AnswerList/AnswerList';
import QuestionsData from '../../../../data/questions.json';

class EditAnswers extends Component {

    state = {
        editingAnswer: null
    };

    questionSpec = QuestionsData;

    startEdit(question) {
        this.setState({ editingAnswer: question });
    }

    cancelEdit(question) {
        this.setState({ editingAnswer: null });
    }

    saveEdit(question, letter) {
        this.props.edited(question, letter);
        this.setState({ editingAnswer: null });
    }

    render() {
        let questions = [];
        for (const code of this.questionSpec.order) {
            const qspec = this.questionSpec.spec[code];
            const aspec = this.questionSpec.spec[code].a;
            let answers = [];
            for (const letter of Object.keys(aspec).sort()) {
                answers.push({
                    letter: letter,
                    text: aspec[letter],
                    clicked: () => this.saveEdit(code, letter)
                });
            }
            questions.push({
                code: code,
                text: qspec.q,
                answers: answers,
                selected: {
                    letter: this.props.answers[code],
                    text: aspec[this.props.answers[code]]
                },
                layout: qspec.layout,
                isEditing: this.state.editingAnswer === code,
                clickedCancel: () => this.cancelEdit(code),
                clickedEdit: () => this.startEdit(code),
            });
        }
        return <AnswerList questions={questions} />;
    };
}

export default EditAnswers;
