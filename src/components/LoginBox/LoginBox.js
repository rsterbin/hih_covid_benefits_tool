import React from 'react';

import './LoginBox.css';

const loginBox = (props) => {
    let button = null;
    if (props.loading) {
        button = <button disabled="disabled" className="Loading">{props.lang.button_text}</button>;
    } else {
        button = <button type="submit">{props.lang.button_text}</button>;
    }

    return (
        <div className="LoginBox">
            {props.loginError ?
                <div className="Error">{props.lang.login_error}</div>
            : null}
            <form method="post" onSubmit={props.submitted}>
                <label>{props.lang.username_label}</label>
                <input type="text" name="username" value={props.username} onChange={props.usernameChanged} autoComplete="username" />
                <label>{props.lang.password_label}</label>
                <input type="password" name="password" value={props.password} onChange={props.passwordChanged} autoComplete="current-password" />
                <div className="ButtonContainer">
                    {button}
                </div>
            </form>
        </div>
    );
}

export default loginBox;
