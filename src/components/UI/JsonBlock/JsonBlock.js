import React from 'react';
import JsonView from 'react-json-view';

import './JsonBlock.css';

const jsonBlock = (props) => {
    let view = null;
    if (props.collapse) {
        view = <JsonView src={props.data} collapsed={true} name={props.root || 'root'} />;
    } else {
        const style = { color: props.color || 'slategray' };
        view = <pre style={style}>{JSON.stringify(props.data, null, 2)}</pre>;
    }
    let classes = [ 'JsonBlock' ];
    if (props.addClasses) {
        for (const c of props.addClasses) {
            classes.push(c);
        }
    }
    return (
        <div className={classes.join(' ')}>
            {view}
        </div>
    );
};

export default jsonBlock;
