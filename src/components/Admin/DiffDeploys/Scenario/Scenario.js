import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import InnerTable from '../SimpleKeys/InnerTable/InnerTable';
import { complexOrSimpleData, getTranslationWrapper, getPairWrapper } from '../../../../utils/comparisons';

const scenario = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props, 'lang_key_result');
    console.log('scenario:props', props);
    console.log('scenario:mydata', mydata);
    if (mydata === null) {
        return null;
    }

    const translate = getTranslationWrapper(props.full, true); // use markdown
    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'enabled',
        label: 'Enabled?',
        display: mydata.enabled ? 'Yes' : 'No'
    }));

    pairs.push(wrap({
        key: 'conditions',
        label: 'Conditions',
        display: <InnerTable keyname="conditions"
            data={{
                conditions: Object.entries(mydata.conditions).map(([key, value]) => {
                    return { name: key, code: value };
                })
            }}
            columns={[
                { key: 'name', label: 'Question', hl: true, class: 'Name' },
                { key: 'code', label: 'Answer Code' }
            ]}
            highlight={highlight} />
    }));

    pairs.push(wrap({
        key: 'help',
        label: 'Help',
        display: <p dangerouslySetInnerHTML={{__html: mydata.help.split(/\n/).join('<br />\n')}}></p>,
    }));

    pairs.push(wrap({
        key: 'lang_key_result',
        label: 'Short response',
        display: translate(mydata.lang_key_result)
    }));

    pairs.push(wrap({
        key: 'lang_key_expanded',
        label: 'Expanded response',
        display: translate(mydata.lang_key_expanded)
    }));

    return (
        <div className="Scenario">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default scenario;
