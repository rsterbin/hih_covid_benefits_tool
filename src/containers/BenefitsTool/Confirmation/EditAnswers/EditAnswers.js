import React, { Component } from 'react';

import AnswerList from '../../../../components/BenefitsTool/AnswerList/AnswerList';

import Questions from '../../../../logic/Questions';

class EditAnswers extends Component {

    state = {
        editingAnswer: null
    };

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
        let questions = Questions.getLocalConfirmation(this.props.answers)
            .map(question => {
                let answers = question.answers.map(answer => {
                    return { ...answer, 
                        clicked: () => this.saveEdit(question.code, answer.letter)
                    };
                });
                return { ...question,
                    answers: answers,
                    isEditing: this.state.editingAnswer === question.code,
                    clickedCancel: () => this.cancelEdit(question.code),
                    clickedEdit: () => this.startEdit(question.code),
                };
            });
        return <AnswerList questions={questions} lang={this.props.lang} />;
    };
}

export default EditAnswers;
