import React from 'react';

import './Spinner.css';

// NB: We can't use language here because this is what we show when language data isn't loaded!

const spinner = (props) => {
    let classes = [ 'Spinner' ];
    if (props.color === 'gray-flipped') {
        classes.push('GrayFlipped');
    }
    return (
        <div className={classes.join(' ')}><span>Loading...</span></div>
    );
};

export default spinner;
