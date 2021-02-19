import React from 'react';

import Accordion from '../../UI/Accordion/Accordion';
import AccordionItem from '../../UI/Accordion/AccordionItem/AccordionItem';

import SingleDiff from './SingleDiff/SingleDiff';
import LangKeysDiff from './SingleDiff/LanguageKeys/LanguageKeys';

const DiffDeploys = (props) => {

    const sections = [
        { key: 'lang_keys', title: 'Language (Keys)' },
        { key: 'lang_en', title: 'Language (Text)' },
        { key: 'questions', title: 'Questions' },
        { key: 'conditions', title: 'Conditions' },
        { key: 'scenarios', title: 'Scenarios' },
        { key: 'resources', title: 'Resources' },
    ];

    let items = [];
    for (const sec of sections) {
        if (props.comparison.diff[sec.key] && !props.comparison.diff[sec.key].match) {
            const cmp = props.comparison.diff[sec.key];
            const dataA = props.dataA.full[sec.key] ? props.dataA.full[sec.key] : null;
            const dataB = props.dataB.full[sec.key] ? props.dataB.full[sec.key] : null;
            let layout = null;
            if (sec.key === 'lang_keys') {
                layout = <LangKeysDiff cmp={cmp} dataA={dataA} dataB={dataB} titles={props.titles} />;
            } else {
                layout = <SingleDiff cmp={cmp} dataA={dataA} dataB={dataB} titles={props.titles} />;
            }
            items.push(
                <AccordionItem key={sec.key} title={sec.title}>
                    {layout}
                </AccordionItem>
            );
        } else {
            items.push(
                <AccordionItem key={sec.key} title={sec.title} disabled />
            );
        }
    }
    return (
        <Accordion>
            {items}
        </Accordion>
    );
};

export default DiffDeploys;
