import React, { useState } from 'react';

import LinkList from '../LinkList/LinkList';
import IconButton from '../IconButton/IconButton';

import './ExpandedSection.css';

const ExpandedSection = (props) => {
    const [expanded, setExpanded] = useState(false);
    let readmore_link = null;
    let expanded_block = null;
    let classes = [ 'ExpandedSection' ];

    if (props.read_more) {
        classes.push('ReadMore');
        let more_classes = [ 'MoreBlock' ];

        const doExpand = (e) => {
            e.preventDefault();
            setExpanded(true);
        };

        const doCollapse = (e) => {
            e.preventDefault();
            setExpanded(false);
        };

        if (expanded) {
            more_classes.push('ExpandedMore');
            readmore_link = (
                <div className="ReadLessLink">
                    <IconButton
                        icon="fas fa-arrow-circle-up"
                        title={props.lang.read_less}
                        append_text={props.lang.read_less}
                        clicked={doCollapse} />
                </div>
            );
        } else {
            more_classes.push('CollapsedMore');
            readmore_link = (
                <div className="ReadMoreLink">
                    <IconButton
                        icon="fas fa-arrow-circle-down"
                        title={props.lang.read_more}
                        append_text={props.lang.read_more}
                        clicked={doExpand} />
                </div>
            );
        }

        expanded_block = (
            <div className={more_classes.join(' ')}>
                <div dangerouslySetInnerHTML={{__html: props.read_more}}></div>
                {props.resources ?
                    <LinkList header={props.resources_header} links={props.resources} />
                : null}
            </div>
        );
    }

    if (props.add_class) {
        classes.push(props.add_class);
    }

    return (
        <div className={classes.join(' ')}>
            {props.header ?
                <h3 className="SectionHeader">{props.header}</h3>
            : null}
            <div className="MainBlock">
                <div dangerouslySetInnerHTML={{__html: props.text}}></div>
                {readmore_link}
            </div>
            {expanded_block}
        </div>
    );
};

export default ExpandedSection;
