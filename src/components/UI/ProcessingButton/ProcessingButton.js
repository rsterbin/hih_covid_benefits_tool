import React from 'react';

import Spinner from '../Spinner/Spinner';

import './ProcessingButton.css';

const processingButton = (props) => {
    let classes = [ 'ProcessingButton' ];
    let content = null;
    let doWork = props.clicked;
    let disabled = false;
    if (props.working) {
        classes.push('Working');
        content = <Spinner color="gray-flipped" />;
        doWork = null;
    } else {
        content = props.text;
    }
    if (props.disabled) {
        classes.push('Disabled');
        disabled = true;
    }
    if (props.size === 'large') {
        classes.push('LargeSize');
    }
    return (
        <div className={classes.join(' ')} onClick={doWork} disabled={disabled}>{content}</div>
    );
};

export default processingButton;
