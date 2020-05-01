import React from 'react';

import './Response.css';

const response = (props) => {
    let i = 0;
    let answer = props.answerSections.map((section) => {
            let items = [];
            if (section.header) {
                items.push(<h3 key={i}>{section.header}</h3>);
                ++i;
            }
            for (const para of section.text) {
                items.push(<p key={i}>{para}</p>);
                ++i;
            }
            return items;
        });
    let resourceBlock = null;
    if (props.resources.length > 0) {
        let j = 0;
        let linkList = props.resources.map((link) => {
            ++j;
            return <li key={j}><a href={link.href} title={link.title}>{link.text}</a></li>
        });
        resourceBlock = (
            <div className="Resources">
                <h4>Resources</h4>
                <ul>
                    {linkList}
                </ul>
            </div>
        );
    }
    return (
        <div>
            <h2>Thanks for doing the right thing!</h2>

            {answer}

            {resourceBlock}

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
