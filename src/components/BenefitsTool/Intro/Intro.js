import React from 'react';

import Controls from '../../UI/Controls/Controls';

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

            <Controls buttons={buttons} errorMessage={props.error} />
        </div>
    );
};

export default intro;
