import React from 'react';

import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/Aux/Aux';

import './Modal.css';

const modal = (props) => {
    let classes = [ 'Modal' ];
    if (props.show) {
        classes.push('Show');
    } else {
        classes.push('Hide');
    }
    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.cancel} />
            <div className={classes.join(' ')}>
                {props.children}
            </div>
        </Aux>
    );
};

export default modal;
