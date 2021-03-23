import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import TranslatedText from '../../TranslatedText/TranslatedText';
import { getMatchType, complexOrSimpleData } from '../../../../utils/comparisons';

const resource = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    if (mydata === null) {
        return null;
    }

    let lang_text = {};
    if ('lang_en' in props.full
        && typeof props.full.lang_en === 'object') {
        lang_text = props.full.lang_en;
    }
    const keyWithTranslation = (lang_key, markdown) => {
        return <TranslatedText lang_key={lang_key} translations={lang_text} markdown={markdown} />
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
        key: 'code',
        label: 'Code (auto-generated)',
        display: mydata.code
    }));

    pairs.push(addMatchType({
        key: 'text',
        label: 'Link Text',
        display: keyWithTranslation(mydata.text, false)
    }));

    pairs.push(addMatchType({
        key: 'desc',
        label: 'Link Description',
        display: keyWithTranslation(mydata.desc, true)
    }));

    pairs.push(addMatchType({
        key: 'link',
        label: 'URL',
        display: mydata.link.en
    }));

    return (
        <div className="Resource">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default resource;
