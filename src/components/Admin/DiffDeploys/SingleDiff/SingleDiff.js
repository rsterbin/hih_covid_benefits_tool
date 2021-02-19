import React from 'react';

import Tabs from '../../../UI/Tabs/Tabs';
import Tab from '../../../UI/Tabs/Tab/Tab';

import './SingleDiff.css';

const SingleDiff = (props) => {
    return (
        <div className="SingleDiff">
            <Tabs>
                <Tab key="comparison" title="Comparison">
                    <h5>Comparison</h5>
                    <pre style={{color: 'blue'}}>{JSON.stringify(props.cmp, null, 2)}</pre>
                </Tab>
                <Tab key="sideA" title={props.titles.a}>
                    <h5>{props.titles.a}</h5>
                    <pre style={{color: 'green'}}>{JSON.stringify(props.dataA, null, 2)}</pre>
                </Tab>
                <Tab key="sideB" title={props.titles.b}>
                    <h5>{props.titles.b}</h5>
                    <pre style={{color: 'purple'}}>{JSON.stringify(props.dataB, null, 2)}</pre>
                </Tab>
            </Tabs>
        </div>
    );
}

export default SingleDiff;
