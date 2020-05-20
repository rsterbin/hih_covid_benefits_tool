import React from 'react';

import './Message.css';

const message = (props) => {
    let classes = [ 'Message' ];
    if (props.type === 'error') {
        classes.push('ErrorMessage');
    } else if (props.type === 'success') {
        classes.push('SuccessMessage');
    }
    let tryagain_text = props.tryagain_text ? props.tryagain_text : 'Try Again?';
    return (
        <div className={classes.join(' ')}>
            <p>{props.text}</p>
            {props.tryagain ?
                <button className="TryAgain" onClick={props.tryagain}>{tryagain_text}</button>
            : null}
        </div>
    );

};

export default message;

