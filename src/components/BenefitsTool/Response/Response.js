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
            if (section.text) {
                items.push(<div key={i} className="ResponseSection" dangerouslySetInnerHTML={{__html: section.text}}></div>);
                ++i;
            }
            return items;
        });
    let resourceBlock = null;
    if (props.resources.length > 0) {
        let linkList = props.resources.map((section) => {
            let items = [];
            if (section.header) {
                items.push(<h5 key={i}>{section.header}</h5>);
            }
            let subList = section.links.map((link) => {
                ++i;
                return <li key={i}><a href={link.link} target="_blank" rel="noopener noreferrer">{link.text}</a></li>
            });
            items.push(<ul key={i}>{subList}</ul>);
            ++i;
            return items;
        });
        resourceBlock = (
            <div className="Resources">
                <h3>{props.resources_header}</h3>
                {props.resources_intro ? (
                <div className="ResourcesIntro" dangerouslySetInnerHTML={{__html: props.resources_intro}}></div>
                ) : null}
                {linkList}
            </div>
        );
    }
    return (
        <div className="Response">
            <h2>{props.header}</h2>
            {answer}
            {resourceBlock}
        </div>
    );
};

export default response;
