import React from 'react';

import Accordion from '../../UI/Accordion/Accordion';
import AccordionItem from '../../UI/Accordion/AccordionItem/AccordionItem';
import JsonBlock from '../../UI/JsonBlock/JsonBlock';

import BasicDiff from './BasicDiff/BasicDiff';
import LangKey from './LangKey/LangKey';

const DiffDeploys = (props) => {

    const sections = [
        { key: 'lang_keys', title: 'Language (Keys)', component: LangKey },
        { key: 'lang_en', title: 'Language (Text)', component: JsonBlock },
        { key: 'questions', title: 'Questions', component: JsonBlock },
        { key: 'conditions', title: 'Conditions', component: JsonBlock },
        { key: 'scenarios', title: 'Scenarios', component: JsonBlock },
        { key: 'resources', title: 'Resources', component: JsonBlock },
    ];

    let items = [];
    const full = { dataA: props.dataA.full, dataB: props.dataB.full };
    for (const sec of sections) {
        if (props.comparison.diff[sec.key] && !props.comparison.diff[sec.key].match) {
            const cmp = props.comparison.diff[sec.key];
            const dataA = props.dataA.full[sec.key] ? props.dataA.full[sec.key] : null;
            const dataB = props.dataB.full[sec.key] ? props.dataB.full[sec.key] : null;
            items.push(
                <AccordionItem key={sec.key} title={sec.title}>
                    <BasicDiff
                        full={full}
                        cmp={cmp}
                        dataA={dataA}
                        dataB={dataB}
                        titles={props.titles}
                        component={sec.component} />
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
