import React from 'react';

import './Question.css';

const question = (props) => {

    let answerButtons = Object.keys(props.answers)
        .map((aKey) => {
            return (
                  <button className="Button AnswerButton" onClick={props.answers[aKey].clicked}>{props.answers[aKey].text}</button>
            );
        });

    return (
        <div>
            <h2>{props.questionText}</h2>

            <div className="ButtonContainer">
                {answerButtons}
            </div>

        </div>
    );
};

export default question;
