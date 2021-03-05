import React, { useState } from 'react';

import RawData from '../RawData/RawData';
import { getMatchType } from '../../../../utils/comparisons';

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

        // Is there an order match/diff?
        if ('order_match' in props.cmp && 'order_diff' in props.cmp) {
            const orderA = props.cmp.order_diff.a_version;
            const orderB = props.cmp.order_diff.b_version;

            const key = '_order_diff';
            let clicked = null;
            let classes = ['DiffLine', 'OrderDiff'];
            if (props.cmp.order_match === false) {
                if (Array.isArray(orderA) && orderA.length < 1) {
                    classes.push('AMissing');
                } else if (Array.isArray(orderB) && orderB.length < 1) {
                    classes.push('BMissing');
                } else {
                    classes.push('Diff');
                }
            }
            if (key === openItem) {
                classes.push('Open');
                clicked = () => setOpenItem(null);
            } else {
                classes.push('Closed');
                clicked = () => setOpenItem(key);
            }

            let handleClasses = [...classes];
            handleClasses.push('HandleRow');
            lines.push(
                <div className={handleClasses.join(' ')} key={key + '-handle'} onClick={clicked}>
                    <div className="ASide">
                        <div className="SideTitle">
                            Order of keys
                        </div>
                    </div>
                    <div className="BSide">
                        <div className="SideTitle">
                            Order of keys
                        </div>
                    </div>
                </div>
            );

            const order_a = props.cmp.order_diff.a_version.map((code, idx) =>
                <li key={idx}>{code}</li>
            );
            const order_b = props.cmp.order_diff.b_version.map((code, idx) =>
                <li key={idx}>{code}</li>
            );

            let bodyClasses = [...classes];
            bodyClasses.push('BodyRow');
            lines.push(
                <div className={bodyClasses.join(' ')} key={key + '-body'}>
                    <div className="ASide">
                        <ul>
                            {order_a}
                        </ul>
                    </div>
                    <div className="BSide">
                        <ul>
                            {order_b}
                        </ul>
                    </div>
                </div>
            );
        }

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

            const matchType = getMatchType(key, props.cmp.diff);
            if (matchType === 'aMissing') {
                classes.push('AMissing');
                handleA = <span>empty</span>;
                handleB = key;
            } else if (matchType === 'bMissing') {
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
                if (matchType === 'complexDiff') {
                    bodyA = <props.interiorComponent dataKey={key} section={props.dataA} highlight={item} full={props.full.dataA} />;
                    bodyB = <props.interiorComponent dataKey={key} section={props.dataB} highlight={item} full={props.full.dataB} />;
                } else {
                    if (item.a_version !== null) {
                        bodyA = <props.interiorComponent dataKey={key} data={item.a_version} full={props.full.dataA} />;
                    }
                    if (item.b_version !== null) {
                        bodyB = <props.interiorComponent dataKey={key} data={item.b_version} full={props.full.dataB} />;
                    }
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
