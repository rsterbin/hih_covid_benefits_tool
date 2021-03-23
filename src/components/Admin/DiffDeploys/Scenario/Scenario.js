import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import InnerTable from '../SimpleKeys/InnerTable/InnerTable';
import TranslatedText from '../../TranslatedText/TranslatedText';
import { getMatchType, complexOrSimpleData } from '../../../../utils/comparisons';

const scenario = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    if (mydata === null) {
        return null;
    }

    let lang_text = {};
    if ('lang_en' in props.full
        && typeof props.full.lang_en === 'object') {
        lang_text = props.full.lang_en;
    }
    const keyWithTranslation = (lang_key) => {
        return <TranslatedText lang_key={lang_key} translations={lang_text} markdown />
    };

    const addMatchType = (pair) => {
        const mt = getMatchType(pair.key, highlight);
        if (mt) {
            pair.matchType = mt;
        }
        return pair;
    };

    let pairs = [];

    pairs.push(addMatchType({
        key: 'enabled',
        label: 'Enabled?',
        display: mydata.enabled ? 'Yes' : 'No'
    }));

    pairs.push(addMatchType({
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

    pairs.push(addMatchType({
        key: 'help',
        label: 'Help',
        display: <p dangerouslySetInnerHTML={{__html: mydata.help.split(/\n/).join('<br />\n')}}></p>,
    }));

    pairs.push(addMatchType({
        key: 'lang_key_result',
        label: 'Short response',
        display: keyWithTranslation(mydata.lang_key_result)
    }));

    pairs.push(addMatchType({
        key: 'lang_key_expanded',
        label: 'Expanded response',
        display: keyWithTranslation(mydata.lang_key_expanded)
    }));

    return (
        <div className="Scenario">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default scenario;
