import React from 'react';

import './StepCounter.css';

const stepCounter = (props) => {

    let bullets = [];
    for (let i = 0; i < props.steps.length; ++i) {
        let step = props.steps[i];
        let className = 'Bullet';
        if (props.currentStep < i) {
            className += ' Unvisited';
        } else if (props.currentStep === i) {
            className += ' Current';
        } else {
            className += ' Visited';
        }
        if (typeof(step.clicked) === 'function') {
            className += ' Clickable';
        }
        bullets.push(<li key={step.title}
            className={className}
            title={step.title}
            onClick={step.clicked}>&middot;</li>);
    }

    return (
        <div className="StepCounter">
            <ul>
                {bullets}
            </ul>
        </div>
    );
};

export default stepCounter;
