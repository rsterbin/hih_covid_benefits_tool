import React from 'react';

import Accordion from '../../UI/Accordion/Accordion';
import AccordionItem from '../../UI/Accordion/AccordionItem/AccordionItem';
import JsonBlock from '../../UI/JsonBlock/JsonBlock';

import BasicDiff from './BasicDiff/BasicDiff';
import BenefitsDiff from './BenefitsDiff/BenefitsDiff';
import LangKey from './LangKey/LangKey';
import LangText from './LangText/LangText';
import Question from './Question/Question';
import Condition from './Condition/Condition';
import Scenario from './Scenario/Scenario';

import './DiffDeploys.css';

const DiffDeploys = (props) => {

    const sections = [
        { key: 'lang_keys', title: 'Language (Keys)', component: BasicDiff, interior: LangKey },
        { key: 'lang_en', title: 'Language (Text)', component: BasicDiff, interior: LangText },
        { key: 'questions', title: 'Questions', component: BasicDiff, interior: Question },
        { key: 'conditions', title: 'Conditions', component: BenefitsDiff, interior: Condition },
        { key: 'scenarios', title: 'Scenarios', component: BenefitsDiff, interior: Scenario },
        { key: 'resources', title: 'Resources', component: BasicDiff, interior: JsonBlock },
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
                    <sec.component
                        full={full}
                        cmp={cmp}
                        dataA={dataA}
                        dataB={dataB}
                        titles={props.titles}
                        interiorComponent={sec.interior} />
                </AccordionItem>
            );
        } else {
            items.push(
                <AccordionItem key={sec.key} title={sec.title} disabled />
            );
        }
    }
    return (
        <div className="DiffDeploys">
            <Accordion>
                {items}
            </Accordion>
        </div>
    );
};

export default DiffDeploys;
