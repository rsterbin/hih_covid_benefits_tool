import React from 'react';

import './Element.css';

const adminElement = (props) => {
    let classes = [ 'AdminFormElement' ];
    if (props.add_class) {
        classes.push(props.add_class);
    }
    return (
        <div className={classes.join(' ')}>
            <h3>{props.label}</h3>
            {props.help ?
                <div className="Description">
                    {props.help}
                </div>
            : null}
            {props.error ?
                <p className="Error">{props.error}</p>
            : null}
            {props.children}
        </div>
    );
};

export default adminElement;
