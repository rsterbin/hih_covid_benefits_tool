import React from 'react';

import './LoginLayout.css';

const loginLayout = (props) => {
    return (
        <div className="LoginFrame">
            <div className="LoginMain">
                {props.children}
            </div>
        </div>
    );
}

export default loginLayout;
