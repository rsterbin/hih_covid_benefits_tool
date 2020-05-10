import React from 'react';

import './ContactInfo.css';

const contactInfo = (props) => {
    return (
        <div className="ContactInfo">
            <h3>Join Hand in Hand</h3>
            <p className="invitation">Hand in Hand provides resources and support for employers of domestic workers. If you’d like to learn more, enter your info here.</p>
            <form method="post" onSubmit={(e) => e.preventDefault()}>
                <label>Email</label>
                {props.emailError ?
                    <div className="Error">We won't be able to contact you without a valid email address.</div>
                : null}
                <input type="text" name="email" value={props.email} onChange={props.emailChanged} autoComplete="email" />
                <label>ZIP Code</label>
                {props.zipError ?
                   <div className="Error">Please enter a valid US ZIP code (55555 or 55555-4444).</div>
                : null}
                <input type="zip" name="zip" value={props.zip} onChange={props.zipChanged} autoComplete="current-zip" />
            </form>
        </div>
    );
}

export default contactInfo;
