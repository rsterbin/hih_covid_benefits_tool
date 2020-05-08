import React from 'react';

import './Confirmation.css';

const confirmation = (props) => {

    const answerList = props.questions.order
        .map((question) => {
            const qtext = props.questions.spec[question].q;
            const atext = props.questions.spec[question].a[props.answers[question]];
            return (
                <li key={question}>
                    <div class="QuestionConfirm">{qtext}</div>
                    <div class="AnswerConfirm">{atext} <button class="EditButton" title="Edit answer"><i class="fas fa-pencil-alt" aria-hidden="true"></i><span>edit</span></button></div>
                </li>
            );
        });

    return (
        <div className="Confirmation">
            <h2 className="ConfirmHeader">Confirm your answers</h2>
            <div className="Answers">
                <ul>
                    {answerList}
                </ul>
            </div>
            <div className="ButtonContainer">
                <button class="Button ConfirmButton" onClick={props.forwardClicked}>Confirm</button>
            </div>
            <div className="BackLink" onClick={props.backClicked}>go back</div>
        </div>
    );

};

export default confirmation;
