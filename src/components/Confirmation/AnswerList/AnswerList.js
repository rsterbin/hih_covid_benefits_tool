import React from 'react';

import './AnswerList.css';

const answerList = (props) => {

    // TODO: Add edit functionality
    // <button class="EditButton" title="Edit answer"><i class="fas fa-pencil-alt" aria-hidden="true"></i><span>edit</span></button>
    const answerList = props.questions.order
        .map((question) => {
            const qtext = props.questions.spec[question].q;
            const atext = props.questions.spec[question].a[props.answers[question]];
            return (
                <li key={question}>
                    <div className="QuestionConfirm">{qtext}</div>
                    <div className="AnswerConfirm">{atext}</div>
                </li>
            );
        });

    return (
        <div className="Answers">
            <h3 className="AnswersHeader">Please confirm your answers</h3>
            <ul>
                {answerList}
            </ul>
        </div>
    );

};

export default answerList;
