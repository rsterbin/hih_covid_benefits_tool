import React from 'react';

import './ContactInfo.css';

const contactInfo = (props) => {
    return (
        <div className="ContactInfo">
            <h3>{props.lang.header}</h3>
            <div className="invitation" dangerouslySetInnerHTML={{__html: props.lang.invitation}}></div>
            <form method="post" onSubmit={(e) => e.preventDefault()}>
                <label>{props.lang.email_label}</label>
                {props.emailError ?
                    <div className="Error">{props.lang.email_error}</div>
                : null}
                <input type="text" name="email" value={props.email} onChange={props.emailChanged} autoComplete="email" />
                <label>{props.lang.zip_label}</label>
                {props.zipError ?
                   <div className="Error">{props.lang.zip_error}</div>
                : null}
                <input type="zip" name="zip" value={props.zip} onChange={props.zipChanged} autoComplete="current-zip" />
            </form>
        </div>
    );
}

export default contactInfo;
