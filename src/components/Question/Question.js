import React from 'react';

import './Question.css';

const question = (props) => {

    let stepBullets = [];
    for (let i = 1; i <= props.stepCount; ++i) {
        if (props.step + 1 < i) {
            stepBullets.push((
                <li key={i} className="UnvisitedBullet">&middot;</li>
            ));
        } else if (props.step + 1 === i) {
            stepBullets.push((
                <li key={i} className="CurrentBullet">&middot;</li>
            ));
        } else {
            stepBullets.push((
                <li key={i} className="VisitedBullet">&middot;</li>
            ));
        }
    }

    let answerButtons = Object.keys(props.answers)
        .map((aKey) => {
            let classes = 'Button AnswerButton';
            if (props.answers[aKey].selected) {
                classes += ' SelectedAnswerButton';
            }
            return (
                  <button key={aKey} className={classes} onClick={props.answers[aKey].clicked}>{props.answers[aKey].text}</button>
            );
        });

    return (
        <div>
            <div className="StepCounter">
                <ul>
                    {stepBullets}
                </ul>
            </div>

            <h2 className="Question">{props.questionText}</h2>

            <div className="ButtonContainer">
                {answerButtons}
            </div>

            <div className="BackLink" onClick={props.backClicked}>go back</div>

        </div>
    );
};

export default question;
