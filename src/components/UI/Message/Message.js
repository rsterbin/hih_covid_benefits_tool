import React from 'react';

import IconButton from '../IconButton/IconButton';

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
                <IconButton icon_type="refresh"
                    clicked={props.tryagain}
                    title={tryagain_text} />
            : null}
            {props.custom_button}
        </div>
    );

};

export default message;

