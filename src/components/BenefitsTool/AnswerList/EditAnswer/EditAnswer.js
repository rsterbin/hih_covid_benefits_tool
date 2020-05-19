import React from 'react';

import Controls from '../../../UI/Controls/Controls';

const editAnswer = (props) => {
    const abuttons = props.answers
        .map((answer) => {
            let btn = {
                key: answer.letter,
                classNames: [ 'AnswerButton' ],
                text: answer.text,
                clicked: answer.clicked
            };
            if (answer.letter === props.selectedAnswer.letter) {
                btn.classNames.push('Selected');
            }
            return btn;
        });

    return (
        <div className="AnswerEdit">
            <button className="CancelButton"
                title={props.lang.cancel_title}
                onClick={props.clickedCancel}>
                <i className="fas fa-times" title={props.lang.cancel_alt}></i>
            </button>
            <Controls
                buttons={abuttons}
                buttonLayout={props.layout} />
        </div>
    );
}

export default editAnswer;
