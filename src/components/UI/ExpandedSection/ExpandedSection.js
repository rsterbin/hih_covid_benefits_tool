import React, { useState } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import LinkList from '../LinkList/LinkList';

import './ExpandedSection.css';

const ExpandedSection = (props) => {
    const [expanded, setExpanded] = useState(false);
    let readmore = null;
    if (props.read_more) {
        let link = null;
        let classes = [ 'MoreBlock' ];
        if (expanded) {
            classes.push('ExpandedMore');
            link = <div className="ReadLessLink" onClick={() => setExpanded(false)}>{props.lang.read_less}</div>;
        } else {
            classes.push('CollapsedMore');
            link = <div className="ReadMoreLink" onClick={() => setExpanded(true)}>{props.lang.read_more}</div>;
        }
        const expBlock = (
            <div className={classes.join(' ')}>
                <div className="ReadMore" dangerouslySetInnerHTML={{__html: props.read_more}}></div>
                {props.resources ?
                    <LinkList header={props.resources_header} links={props.resources} />
                : null}
            </div>
        );
        readmore = (
            <Aux>
                {link}
                {expBlock}
            </Aux>
        );
    }
    return (
        <div className="ExpandedSection">
            {props.header ?
                <h3 className="SectionHeader">{props.header}</h3>
            : null}
            <div className="ResponseSection" dangerouslySetInnerHTML={{__html: props.text}}></div>
            {readmore}
        </div>
    );
};

export default ExpandedSection;
