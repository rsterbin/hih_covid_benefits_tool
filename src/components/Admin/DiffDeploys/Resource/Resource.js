import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import { complexOrSimpleData, getTranslationWrapper, getPairWrapper } from '../../../../utils/comparisons';

const resource = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props, 'code');
    if (mydata === null) {
        return null;
    }

    const translate = getTranslationWrapper(props.full);
    const translate_md = getTranslationWrapper(props.full, true);
    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'code',
        label: 'Code (auto-generated)',
        display: mydata.code
    }));

    pairs.push(wrap({
        key: 'text',
        label: 'Link Text',
        display: translate(mydata.text)
    }));

    pairs.push(wrap({
        key: 'desc',
        label: 'Link Description',
        display: translate_md(mydata.desc)
    }));

    pairs.push(wrap({
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
