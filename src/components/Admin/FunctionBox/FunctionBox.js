import React from 'react';

import ProcessingButton from '../../UI/ProcessingButton/ProcessingButton';
import RawTextBox from '../../UI/RawTextBox/RawTextBox';
import Message from '../../UI/Message/Message';

import './FunctionBox.css';

const functionBox = (props) => {
    let emptytext = null;
    if (props.working) {
        emptytext = 'processing...';
    } else if (props.emptyText) {
        emptytext = props.emptyText;
    }
    let boxContents = null;
    if (props.results) {
        boxContents = props.results;
    }
    return (
        <div className="FunctionBox">
            <h3>{props.title}</h3>
            <p className="Explainer">{props.explainer}</p>
            <ProcessingButton
                size="large"
                working={props.working}
                clicked={props.clicked}
                text={props.buttonText} />
            {props.error ?
                <Message type="error" text={props.error} />
            : props.successBox}
            <RawTextBox contents={boxContents} emptytext={emptytext} />
        </div>
    );
};

export default functionBox;
