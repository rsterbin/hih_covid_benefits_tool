import React from 'react';

import SimpleKeys from '../SimpleKeys/SimpleKeys';
import { complexOrSimpleData, getPairWrapper } from '../../../../utils/comparisons';

import './LangKey.css';

const LangKey = (props) => {

    const [ mydata, highlight ] = complexOrSimpleData(props);
    console.log('langKey:props', props);
    console.log('langKey:mydata', mydata);
    if (mydata === null) {
        return null;
    }

    const wrap = getPairWrapper(highlight, mydata);

    let pairs = [];

    pairs.push(wrap({
        key: 'section',
        label: 'Section',
        display: mydata.section
    }));

    let help = null;
    if (mydata.help) {
        const md = require('markdown-it')();
        const markup = md.render(mydata.help);
        help = <div dangerouslySetInnerHTML={{__html: markup}}></div>;
    } else {
        help = <span className="empty">none</span>;
    }
    pairs.push(wrap({
        key: 'help',
        label: 'Help',
        display: help,
        addClass: 'LangKeysHelp'
    }));

    pairs.push(wrap({
        key: 'token_replace',
        label: 'Tokens that can be replaced:',
        display: mydata.token_replace ? mydata.token_replace : <span className="empty">none</span>
    }));

    pairs.push(wrap({
        key: 'markdown_allowed',
        label: 'Is markdown allowed?',
        display: mydata.markdown_allowed ? 'Yes' : 'No'
    }));

    return (
        <div className="LangKey">
            <SimpleKeys pairs={pairs} />
        </div>
    );

};

export default LangKey;
