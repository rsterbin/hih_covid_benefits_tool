import React from 'react';

import ViewAnswer from './ViewAnswer/ViewAnswer';
import EditAnswer from './EditAnswer/EditAnswer';

import './AnswerList.css';

const answerList = (props) => {

    const answerList = props.questions
        .map((question) => {
            let answerBlock = null;
            if (question.isEditing) {
                answerBlock = <EditAnswer
                    lang={props.lang}
                    answers={question.answers}
                    selectedAnswer={question.selected}
                    clickedCancel={question.clickedCancel}
                    layout={question.layout} />;
            } else {
                answerBlock = <ViewAnswer
                    lang={props.lang}
                    selectedAnswer={question.selected}
                    clickedEdit={question.clickedEdit} />
            }
            return (
                <li key={question.code}>
                    <div className="QuestionConfirm">{question.text}</div>
                    {answerBlock}
                </li>
            );
        });

    return (
        <div className="Answers">
            <h3 className="AnswersHeader">{props.lang.header}</h3>
            <ul>
                {answerList}
            </ul>
        </div>
    );

}

export default answerList;
