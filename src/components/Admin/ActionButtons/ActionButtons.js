import React from 'react';

import IconButton from '../../UI/IconButton/IconButton';

import './ActionButtons.css';

const actionButtons = (props) => {
    let i = 0;
    const buttons = props.buttons.map(button => {
        ++i;
        if (button.clicked) {
            const action = (e) => {
                e.preventDefault();
                button.clicked(e);
            }
            return (
                <IconButton key={i}
                    icon={button.icon}
                    title={button.title}
                    append_text={button.title}
                    clicked={action} />
            );
        } else if (button.link) {
            return (
                <a href={button.link} className="ActionLink" key={i}>
                    <i className={button.icon} title={button.title}></i>
                    <span>{button.title}</span>
                </a>
            );
        } else {
            return null;
        }
    });
    return (
        <div className="ActionButtons">
            {buttons}
        </div>
    );
};

export default actionButtons;
