import React from 'react';

import IconButton from '../../UI/IconButton/IconButton';

import './ActionButtons.css';

const actionButtons = (props) => {
    let i = 0;
    const buttons = props.buttons.map(button => {
        ++i;
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
    });
    return (
        <div className="ActionButtons">
            {buttons}
        </div>
    );
};

export default actionButtons;
