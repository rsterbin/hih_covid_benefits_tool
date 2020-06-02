import React from 'react';

import './IconButton.css';

const iconButton = (props) => {
    let classes = [ 'IconButton' ];
    let title = null;
    let icon = 'fas fa-question';
    if (props.icon_type === 'refresh') {
        title = 'refresh';
        icon = 'fas fa-sync-alt';
    } else if (props.icon_type === 'edit') {
        title = 'edit';
        icon = 'fas fa-pencil-alt';
    } else if (props.icon_type === 'preview') {
        title = 'preview';
        icon = 'far fa-eye';
    }
    if (props.title) {
        title = props.title;
    }
    if (props.icon) {
        icon = props.icon;
    }
    if (props.add_class) {
        classes.push(props.add_class);
    }
    return (
        <button className={classes.join(' ')} onClick={props.clicked}>
            <i className={icon} title={title}></i>
            {props.append_text ?
                <span>{props.append_text}</span>
            : null}
        </button>
    );
};

export default iconButton;
