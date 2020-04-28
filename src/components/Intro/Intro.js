import React from 'react';

import './Intro.css';

const intro = (props) => {
    return (
        <div>
            <h2>Welcome to the COVID-19 Employer Benefits Tool</h2>

            <p>Domestic workers do the work that makes all other work possible. It's crucial to recognize the work of nannies, house cleaners and home attendants who are on the frontlines of our response to COVID-19.</p>

            <p>This tool makes it easier for employers to discover what benefits their employees are entitled to, and provides links to find out more or apply.</p>

            <p><strong>NB:</strong> This tool is currently a DRAFT.</p>

            <div className="ButtonContainer">
                <button className="Button StartButton" onClick={props.clicked}>Start</button>
            </div>

        </div>
    );
};

export default intro;
