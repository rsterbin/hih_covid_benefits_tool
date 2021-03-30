import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import { complexOrSimpleData, getPairWrapper } from '../../../../utils/comparisons';

const benefit = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    if (mydata === null) {
        return null;
    }

    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'abbreviation',
        label: 'Abbreviation',
        display: mydata.abbreviation
    }));

    pairs.push(wrap({
        key: 'name',
        label: 'Name',
        display: mydata.name
    }));

    return (
        <div className="Benefit">
            <SimpleKeys pairs={pairs} />
        </div>
    );


};

export default benefit;
