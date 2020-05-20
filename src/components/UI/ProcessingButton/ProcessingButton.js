import React from 'react';

import Spinner from '../Spinner/Spinner';

import './ProcessingButton.css';

const processingButton = (props) => {
    let classes = [ 'ProcessingButton' ];
    let content = null;
    let doWork = props.clicked;
    if (props.working) {
        classes.push('Working');
        content = <Spinner color="gray-flipped" />;
        doWork = null;
    } else {
        content = props.text;
    }
    if (props.size === 'large') {
        classes.push('LargeSize');
    }
    return (
        <div className={classes.join(' ')} onClick={doWork}>{content}</div>
    );
};

export default processingButton;
