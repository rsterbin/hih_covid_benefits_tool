import React from 'react';

import './LoginBox.css';

const loginBox = (props) => {
    let button = null;
    if (props.loading) {
        button = <button disabled="disabled" className="Loading">Submit</button>;
    } else {
        button = <button type="submit">Submit</button>;
    }

    return (
        <div className="LoginBox">
            {props.loginError ?
                <div className="Error">You could not be logged in.</div>
            : null}
            <form method="post" onSubmit={props.submitted}>
                <label>Username</label>
                <input type="text" name="username" value={props.username} onChange={props.usernameChanged} autoComplete="username" />
                <label>Password</label>
                <input type="password" name="password" value={props.password} onChange={props.passwordChanged} autoComplete="current-password" />
                <div className="ButtonContainer">
                    {button}
                </div>
            </form>
        </div>
    );
}

export default loginBox;
