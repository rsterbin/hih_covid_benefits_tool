import React from 'react';

const viewAnswer = (props) => {
    return (
        <div className="AnswerConfirm">
            <span className="SelectedAnswer">{props.selectedAnswer.text}</span>
            <button
                className="EditButton"
                title="Edit answer"
                onClick={props.clickedEdit}>
                <i className="fas fa-pencil-alt" aria-hidden="true"></i>
                <span>edit</span>
            </button>
        </div>
    );
}

export default viewAnswer;
