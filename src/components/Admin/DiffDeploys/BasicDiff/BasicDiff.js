import React, { useState } from 'react';

import RawData from '../RawData/RawData';

import './BasicDiff.css';

const BasicDiff = (props) => {

    const [openItem, setOpenItem] = useState(null);
    const [showRaw, setShowRaw] = useState(null);

    let content = null;
    if (showRaw === 'rawA') {
        content = <RawData
            title={props.titles.a}
            color="red"
            closed={() => setShowRaw(null)}
            data={props.dataA}
            />;

    } else if (showRaw === 'rawB') {
        content = <RawData
            title={props.titles.b}
            color="green"
            closed={() => setShowRaw(null)}
            data={props.dataB}
            />;

    } else {

        let lines = [];

        // Table Header
        lines.push(
            <div className="DiffLine HeaderOnly" key="--header-only">
                <div className="ASide">
                    <div className="SideTitle">
                        <span>{props.titles.a}</span>
                        <button className="mockLink OpenRaw" onClick={() => setShowRaw('rawA')}>(raw)</button>
                    </div>
                </div>
                <div className="BSide">
                    <div className="SideTitle">
                        <span>{props.titles.b}</span>
                        <button className="mockLink OpenRaw" onClick={() => setShowRaw('rawB')}>(raw)</button>
                    </div>
                </div>
            </div>
        );

        // Loop through and build row sets (one for the key, one for the body)

        let keys = Object.keys(props.cmp.diff);
        keys.sort();

        for (const key of keys) {
            const item = props.cmp.diff[key];

            let classes = [ 'DiffLine' ];
            let clicked = null;
            let handleA = null;
            let handleB = null;
            let bodyA = null;
            let bodyB = null;

            if (item.a_version === null) {
                classes.push('AMissing');
                handleA = <span>empty</span>;
                handleB = key;
            } else if (item.b_version === null) {
                classes.push('BMissing');
                handleA = key;
                handleB = <span>empty</span>;
            } else {
                classes.push('Diff');
                handleA = key;
                handleB = key;
            }

            if (key === openItem) {
                classes.push('Open');
                clicked = () => setOpenItem(null);
                if (item.a_version !== null) {
                    bodyA = <props.component data={item.a_version} full={props.full.a} />;
                }
                if (item.b_version !== null) {
                    bodyB = <props.component data={item.b_version} full={props.full.b} />;
                }
            } else {
                classes.push('Closed');
                clicked = () => setOpenItem(key);
            }

            let handleClasses = [...classes];
            handleClasses.push('HandleRow');
            lines.push(
                <div className={handleClasses.join(' ')} key={key + '-handle'} onClick={clicked}>
                    <div className="ASide">
                        {handleA}
                    </div>
                    <div className="BSide">
                        {handleB}
                    </div>
                </div>
            );

            let bodyClasses = [...classes];
            bodyClasses.push('BodyRow');
            lines.push(
                <div className={bodyClasses.join(' ')} key={key + '-body'}>
                    <div className="ASide">
                        {bodyA}
                    </div>
                    <div className="BSide">
                        {bodyB}
                    </div>
                </div>
            );

            content = (
                <div className="DiffTable">
                    {lines}
                </div>
            );
        }
    }

    return (
        <div className="BasicDiff">
            {content}
        </div>
    );
};

export default BasicDiff;
