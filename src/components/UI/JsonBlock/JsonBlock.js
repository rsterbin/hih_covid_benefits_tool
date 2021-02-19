import React from 'react';

import './JsonBlock.css';

const jsonBlock = (props) => {
    const style = { color: props.color || 'slategray' };
    return (
        <div className="JsonBlock">
            <pre style={style}>{JSON.stringify(props.data, null, 2)}</pre>
        </div>
    );
};

export default jsonBlock;
