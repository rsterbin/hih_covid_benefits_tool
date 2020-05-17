import React from 'react';

import './Question.css';

const question = (props) => {
    return (
        <div className="Question">
            <h2 className="QuestionHeader">{props.questionText}</h2>

            {props.helpText ? <p className="Help" dangerouslySetInnerHTML={{__html: props.helpText}}></p> : null}
        </div>
    );
};

export default question;
