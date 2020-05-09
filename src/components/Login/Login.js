import React from 'react';

import './Login.css';

const login = (props) => {
    let button = null;
    if (props.loading) {
        button = <button disabled="disabled" className="Loading">Submit</button>;
    } else {
        button = <button type="submit">Submit</button>;
    }

    return (
        <div className="LoginFrame">
            <div className="LoginBox">
                {props.loginError ?
                    <div class="Error">You could not be logged in.</div>
                : null}
                <form method="post" onSubmit={props.submitted}>
                    <label>Username</label>
                    <input type="text" name="username" value={props.username} onChange={props.usernameChanged} />
                    <label>Password</label>
                    <input type="password" name="password" value={props.password} onChange={props.passwordChanged} />
                    <div className="ButtonContainer">
                        {button}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default login;
