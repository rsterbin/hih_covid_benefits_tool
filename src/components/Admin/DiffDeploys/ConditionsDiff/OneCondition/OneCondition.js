import React from 'react';

import SimpleKeys from '../../SimpleKeys/SimpleKeys';
import InnerTable from '../../SimpleKeys/InnerTable/InnerTable';
import { getMatchType, complexOrSimpleData } from '../../../../../utils/comparisons';

import './OneCondition.css';

const oneCondition = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    if (mydata === null) {
        return null;
    }

    const addMatchType = (pair) => {
        const mt = getMatchType(pair.key, highlight);
        if (mt) {
            pair.matchType = mt;
        }
        return pair;
    };

    let pairs = [];

    pairs.push(addMatchType({
        key: 'name',
        label: 'Name',
        display: mydata.name
    }));

    pairs.push(addMatchType({
        key: 'code',
        label: 'name',
        display: mydata.code
    }));

    pairs.push(addMatchType({
        key: 'pass',
        label: 'Pass',
        display: mydata.pass
    }));

    pairs.push(addMatchType({
        key: 'method',
        label: 'Method',
        display: mydata.method
    }));

    pairs.push(addMatchType({
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

/*
    {
      "name": "On the Books?",
      "code": "books",
      "pass": "first",
      "method": "splitBooksByCompliance",
      "outcomes": [
        {
          "answer": "YES, IN COMPLIANCE",
          "letter": "C"
        },
        {
          "answer": "PARTIALLY OR NO",
          "letter": "N"
        }
      ]
    }
 */

};

export default oneCondition;
