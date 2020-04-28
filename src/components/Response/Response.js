import React from 'react';

import './Response.css';

const response = (props) => {
    let i = 0;
    let answerText = props.answerParas.map((ptext) => {
            ++i;
            return <p key={i}>{ptext}</p>;
        });
    return (
        <div>
            <h2>Thanks for doing the right thing!</h2>

            {answerText}

            <div className="ButtonContainer">
                <button className="Button CTAButton" onClick={() => { window.open('https://domesticemployers.org/take-the-pledge/', '_blank'); } }>Take the Pledge</button>
                <button className="Button CTAButton">CTA Button #2</button>
                <button className="Button CTAButton">CTA Button #3</button>
            </div>

            <div className="BackLink" onClick={props.backClicked}>go back</div>
            <div className="RestartLink" onClick={props.restartClicked}>restart quiz</div>

        </div>
    );
};

export default response;
