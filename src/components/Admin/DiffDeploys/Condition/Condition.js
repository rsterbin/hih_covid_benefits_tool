import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import InnerTable from '../SimpleKeys/InnerTable/InnerTable';
import { complexOrSimpleData, getPairWrapper } from '../../../../utils/comparisons';

import './Condition.css';

const condition = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props, 'code');
    console.log('condition:props', props);
    console.log('condition:mydata', mydata);
    if (mydata === null) {
        return null;
    }

    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'name',
        label: 'Name',
        display: mydata.name
    }));

    pairs.push(wrap({
        key: 'code',
        label: 'name',
        display: mydata.code
    }));

    pairs.push(wrap({
        key: 'pass',
        label: 'Pass',
        display: mydata.pass
    }));

    pairs.push(wrap({
        key: 'method',
        label: 'Method',
        display: mydata.method
    }));

    pairs.push(wrap({
        key: 'outcomes',
        label: 'Outcomes',
        display: <InnerTable keyname="outcomes"
            data={mydata}
            columns={[
                { key: 'letter', label: 'Letter', hl: true, class: 'Letter' },
                { key: 'answer', label: 'Answer(s)' }
            ]}
            highlight={highlight} />
    }));

    return (
        <div className="Question">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default condition;
