import React, { Component } from 'react';

import Controls from '../../UI/Controls/Controls';

import './AnswerList.css';

class AnswerList extends Component {

    state = {
        editingAnswer: null
    };

    startEdit(question) {
        this.setState({ editingAnswer: question });
    }

    cancelEdit(question) {
        this.setState({ editingAnswer: null });
    }

    renderQuestion(question) {
        const qspec = this.props.questions.spec[question];
        const qtext = qspec.q;
        const aspec = this.props.questions.spec[question].a;
        const atext = aspec[this.props.answers[question]];

        // We either display the answer already chosen, or show the buttons for
        // each possible answer (with the one they chose selected), and let them
        // pick a new one if they want.  We use a little pencil next to the
        // answer to open the editing block and an x floating to the right of
        // the buttons to close it without saving.
        let answerBlock = null;
        if (this.state.editingAnswer === question) {

            // Set up the buttons spec for the controls component
            const abuttons = Object.keys(aspec).sort()
                .map((letter) => {
                    let btn = {
                        key: letter,
                        classNames: [ 'AnswerButton' ],
                        text: aspec[letter],
                        clicked: () => {
                            this.props.edited(question, letter);
                            this.setState({ editingAnswer: null });
                        }
                    };
                    if (letter === this.props.answers[question]) {
                        btn.classNames.push('Selected');
                    }
                    return btn;
                });

            // Editing block
            answerBlock = (
                <div className="AnswerEdit">
                    <button className="CancelButton"
                        title="Stop editing answer"
                        onClick={() => this.cancelEdit(question)}>
                        <i className="fas fa-times" aria-hidden="true"></i>
                        <span>cancel</span>
                    </button>
                    <Controls
                        buttons={abuttons}
                        buttonLayout={qspec.layout} />
                </div>
            );

        } else {
            // View block
            answerBlock = (
                <div className="AnswerConfirm">
                    <span className="SelectedAnswer">{atext}</span>
                    <button
                        className="EditButton"
                        title="Edit answer"
                        onClick={() => this.startEdit(question)}>
                        <i className="fas fa-pencil-alt" aria-hidden="true"></i>
                        <span>edit</span>
                    </button>
                </div>
            );
        }

        // Either way, the question gets bolded above the answer area
        return (
            <li key={question}>
                <div className="QuestionConfirm">{qtext}</div>
                {answerBlock}
            </li>
        );
    }

    render() {

        const answerList = this.props.questions.order
            .map((question) => this.renderQuestion(question));

        return (
            <div className="Answers">
                <h3 className="AnswersHeader">Please confirm your answers</h3>
                <ul>
                    {answerList}
                </ul>
            </div>
        );

    };
}

export default AnswerList;
