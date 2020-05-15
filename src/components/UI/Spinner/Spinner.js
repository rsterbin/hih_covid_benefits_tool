import React from 'react';

import './Spinner.css';

// NB: We can't use language here because this is what we show when language data isn't loaded!

const spinner = (props) => {
    return (
        <div className="Spinner">Loading...</div>
    );
};

export default spinner;
