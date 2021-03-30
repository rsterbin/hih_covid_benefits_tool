import React, { useState } from 'react';

import './Accordion.css';

const Accordion = (props) => {
    const childIndex = props.children.map((el, i) => {
        return {
            key: el.key || i,
            title: el.props.title || 'Item #' + i,
			disabled: el.props.disabled || false,
        };
    });
    const startval = props.init || null;
    const [currentItem, setCurrentItem] = useState(startval);
    return (
        <div className="AccordionWrapper">
            {props.children.map((el, i) => {
                const idx = childIndex[i];
				let classes = [ 'ItemWrapper' ];
                let click = null;
                let body = null;

                if (currentItem === idx.key) {
                    classes.push('ItemActive');
                    click = () => setCurrentItem(null);
                    body = (
                        <div className="ItemBody" key="body">
                            {el}
                        </div>
                    );
                } else {
                    if (idx.disabled) {
                        classes.push('ItemDisabled');
                    } else {
                        click = () => setCurrentItem(idx.key);
                    }
                }
                return (
                    <div className={classes.join(' ')} key={idx.key}>
                        <div className="ItemHandle" key="handle" onClick={click}>
                            {idx.title}
                        </div>
                        {body}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;
