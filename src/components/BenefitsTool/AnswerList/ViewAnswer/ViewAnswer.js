import React from 'react';

const viewAnswer = (props) => {
    return (
        <div className="AnswerConfirm">
            <span className="SelectedAnswer">{props.selectedAnswer.text}</span>
            <button
                className="EditButton"
                title={props.lang.edit_title}
                onClick={props.clickedEdit}>
                <i className="fas fa-pencil-alt" aria-hidden="true"></i>
                <span>{props.lang.edit_alt}</span>
            </button>
        </div>
    );
}

export default viewAnswer;