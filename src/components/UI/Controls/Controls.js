import React from 'react';

import './Controls.css';

const controls = (props) => {

    let buttons = {};
    if (typeof props.buttons !== 'undefined') {
        buttons = props.buttons
            .map((button) => {
                let attributes = {
                    key: button.key ? button.key : button.text,
                };
                let cname = 'ControlButton';
                if (button.classNames) {
                    cname += ' ' + button.classNames.join(' ');
                }
                if (button.disabled) {
                    attributes.disabled = true;
                    cname += ' DisabledButton';
                }
                if (typeof button.clicked === 'function') {
                    attributes.onClick = button.clicked;
                }
                attributes.className = cname;
                return <button {...attributes}>{button.text}</button>;
            });
    }

    let links = {};
    if (typeof props.links !== 'undefined') {
        links = props.links
            .map((link) => {
                let cname = 'ControlLink';
                if (link.classNames) {
                    cname += ' ' + link.classNames.join(' ');
                }
                return <div key={link.key ? link.key : link.text} className={cname} onClick={link.clicked}>{link.text}</div>;
            });
    }

    return (
        <div className="Controls">
        {props.errorMessage ?
            <div className="ControlsError">
                <p>{props.errorMessage}</p>
            </div>
        : null}
        {buttons.length > 0 ?
            <div className={props.buttonLayout === 'vert' ? 'VertButtonContainer' : 'ButtonContainer'}>
                {buttons}
            </div>
        : null}
        {links.length > 0 ?
            <div className="LinkContainer">
                {links}
            </div>
        : null}
        </div>
    );

};

export default controls;
