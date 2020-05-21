import React from 'react';

import './IconButton.css';

const iconButton = (props) => {
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
    return (
        <button className="IconButton" onClick={props.clicked}>
            <i className={icon} title={title}></i>
            {props.append_text ?
                <span>{props.append_text}</span>
            : null}
        </button>
    );
};

export default iconButton;
