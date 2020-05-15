import React from 'react';

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
                <h4>{props.lang.resources_header}</h4>
                <ul>
                    {linkList}
                </ul>
            </div>
        );
    }
    return (
        <div>
            <h2>{props.header}</h2>
            {answer}
            {resourceBlock}
        </div>
    );
};

export default response;
