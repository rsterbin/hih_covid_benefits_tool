import React from 'react';
import { Link } from 'react-router-dom';

import Controls from '../../UI/Controls/Controls';

import './Intro.css';

const intro = (props) => {

    const buttons = [
        {
            classNames: [ 'StartButton' ],
            clicked: props.clicked,
            text: 'Start'
        }
    ];

    return (
        <div>
            <h2>{props.lang.header}</h2>

            <div className="IntroMessage" dangerouslySetInnerHTML={{__html: props.lang.message}}></div>

            <div className="DisclaimerLink" title={props.lang.disclaimer_title}>
                <Link to="/disclaimer">{props.lang.disclaimer_link}</Link>
            </div>

            <Controls buttons={buttons} errorMessage={props.error} />
        </div>
    );
};

export default intro;
