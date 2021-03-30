import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import InnerTable from '../SimpleKeys/InnerTable/InnerTable';
import { complexOrSimpleData, getTranslationWrapper, getPairWrapper } from '../../../../utils/comparisons';

import './Question.css';

const question = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    console.log('question:props', props);
    console.log('question:mydata', mydata);
    if (mydata === null) {
        return null;
    }

    const translate = getTranslationWrapper(props.full);
    const translate_md = getTranslationWrapper(props.full, true);
    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'full_lang_key',
        label: 'full question',
        display: translate(mydata.full_lang_key)
    }));

    pairs.push(wrap({
        key: 'title_lang_key',
        label: 'Question title',
        display: translate(mydata.title_lang_key)
    }));

    pairs.push(wrap({
        key: 'help_lang_key',
        label: 'Question help text',
        display: translate_md(mydata.help_lang_key)
    }));

    pairs.push(wrap({
        key: 'answers',
        label: 'Answers',
        display: <InnerTable keyname="answers"
            data={mydata}
            columns={[
                { key: 'letter', label: 'Letter', hl: true, class: 'Letter' },
                { key: 'lang_key', label: 'Answer Text',
                    display: (answer) => translate(answer.lang_key) }
            ]}
            highlight={highlight} />
    }));

    pairs.push(wrap({
        key: 'layout',
        label: 'Answer button layout',
        display: mydata.layout === 'vert' ? 'vertical' : 'horizontal'
    }));

    return (
        <div className="Question">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default question;
