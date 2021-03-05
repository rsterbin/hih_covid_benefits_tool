import React, { useState } from 'react';

import './Tabs.css';

const UiTabs = (props) => {
    const childIndex = props.children.map((el, i) => {
        return {
            key: el.key || i,
            title: el.props.title || 'Tab #' + i
        };
    });
    const startval = props.init || childIndex[0].key;
    const [currentTab, setCurrentTab] = useState(startval);
    return (
        <div className="TabsWrapper">
            <div className="TabBar" key="bar">
                {childIndex.map(idx => {
                    let c = [ 'TabTitle' ];
                    if (idx.key === currentTab) {
                        c.push('ActiveTab');
                    }
                    return (
                        <div className={c.join(' ')} onClick={() => setCurrentTab(idx.key)} key={idx.key}>
                            {idx.title}
                        </div>
                    );
                })}
            </div>
            <div className="TabsBody" key="body">
            {props.children.map((el, i) => {
                const idx = childIndex[i];
                if (currentTab === idx.key) {
                    return (
                        <div className="TabWrapper" key={idx.key}>
                            {el}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
            </div>
        </div>
    );
};

export default UiTabs;
