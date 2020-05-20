import React from 'react';

import './RawTextBox.css';

const rawTextBox = (props) => {
    let classes = [ 'RawTextBox' ];
    let rawtext = null;
    if (!props.contents) {
        classes.push('Empty');
        rawtext = props.emptytext || 'empty';
    } else {
        rawtext = props.contents;
    }
    return (
        <div className={classes.join(' ')}>
            {props.title ?
                <h6 className="RawTextBoxTitle">{props.title}</h6>
            : null}
            <pre>
            {rawtext}
            </pre>
        </div>
    );
};

export default rawTextBox;
