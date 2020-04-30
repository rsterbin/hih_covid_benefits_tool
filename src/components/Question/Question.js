import React from 'react';

import './Question.css';

const question = (props) => {

    const stepBullets = props.steps
        .map((step) => {
            let className = 'Bullet';
            if (step.timeline === 'present') {
                className += ' Current';
            } else if (step.timeline === 'past') {
                className += ' Visited';
            } else if (step.timeline === 'future') {
                className += ' Unvisited';
            }
            if (typeof(step.clicked) === 'function') {
                className += ' Clickable';
            }
            return (
                <li key={step.title}
                    className={className}
                    title={step.title}
                    onClick={step.clicked}>&middot;</li>
            );
        });

    const answerButtons = Object.keys(props.answers)
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

            {props.helpText ? <p className="Help">{props.helpText}</p> : null}

            <div className={props.answerLayout === 'horiz' ? 'ButtonContainer' : 'VertButtonContainer'}>
                {answerButtons}
            </div>

            <div className="BackLink" onClick={props.backClicked}>go back</div>

        </div>
    );
};

export default question;
