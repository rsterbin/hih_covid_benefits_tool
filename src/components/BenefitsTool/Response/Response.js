import React from 'react';

import ExpandedSection from '../../UI/ExpandedSection/ExpandedSection';
import LinkList from '../../UI/LinkList/LinkList';

import './Response.css';

const response = (props) => {
    let i = 0;
    let answer = props.answerSections.map((section) => {
        ++i;
        return <ExpandedSection key={i}
            add_class={section.type === 'benefit' ? 'Benefit' : ''}
            lang={props.lang}
            {...section} />;
    });
    let resourceBlock = null;
    if (props.resources.length > 0) {
        resourceBlock = (
            <div className="Resources">
                <h3>{props.resources_header}</h3>
                {props.resources_intro ? (
                <div className="ResourcesIntro" dangerouslySetInnerHTML={{__html: props.resources_intro}}></div>
                ) : null}
                <LinkList links={props.resources} />
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
