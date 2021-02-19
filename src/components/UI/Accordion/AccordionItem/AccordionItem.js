import React from 'react';

const AccordionItem = (props) => {
    return (
        <div className="AccordionItem">
            {props.children}
        </div>
    );
}

export default AccordionItem;
