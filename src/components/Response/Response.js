import React from 'react';

import './Response.css';

const response = (props) => {
    let answerTitle = 'Thanks for doing the right thing!';
    let answerText = (
        <div className="ResponseText">
            <p>Here is the response that we show when we don't have something already written up!</p>
        </div>
    );
    return (
        <div>
            <h2>{answerTitle}</h2>

            {answerText}

            <div className="ButtonContainer">
                <button className="Button CTAButton">CTA Button #1</button>
                <button className="Button CTAButton">CTA Button #2</button>
            </div>

        </div>
    );
};

export default response;
