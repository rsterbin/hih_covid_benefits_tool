import React from 'react';

import Accordion from '../../UI/Accordion/Accordion';
import AccordionItem from '../../UI/Accordion/AccordionItem/AccordionItem';
import JsonBlock from '../../UI/JsonBlock/JsonBlock';

import BasicDiff from './BasicDiff/BasicDiff';
import BenefitsDiff from './BenefitsDiff/BenefitsDiff';
import ResourcesDiff from './ResourcesDiff/ResourcesDiff';
import LangKey from './LangKey/LangKey';
import LangText from './LangText/LangText';
import Question from './Question/Question';
import Benefit from './Benefit/Benefit';
import Condition from './Condition/Condition';
import Scenario from './Scenario/Scenario';
import Resource from './Resource/Resource';

import './DiffDeploys.css';

const DiffDeploys = (props) => {

    const sections = [
        { key: 'lang_keys', title: 'Language (Keys)', component: BasicDiff, interior: LangKey },
        { key: 'lang_en', title: 'Language (Text)', component: BasicDiff, interior: LangText },
        { key: 'questions', title: 'Questions', component: BasicDiff, interior: Question },
        { key: 'benefits', title: 'Benefits', component: BasicDiff, interior: Benefit },
        { key: 'conditions', title: 'Conditions', component: BenefitsDiff, interior: Condition },
        { key: 'scenarios', title: 'Scenarios', component: BenefitsDiff, interior: Scenario, listKey: 'lang_key_result' },
        { key: 'resources', title: 'Resources', component: ResourcesDiff, interior: Resource, listKey: 'code' },
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
                        interiorComponent={sec.interior}
                        listKey={sec.listKey} />
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
            <h3>Explore Comparison</h3>
            {props.comparison.match && <p>Nothing to explore</p>}
            {!props.comparison.match && <Accordion key="explore">
                {items}
            </Accordion>}
            <h3>Raw Comparison Data</h3>
            <Accordion key="raw">
                <AccordionItem key="comparison" title="Comparison">
                    <JsonBlock data={props.comparison} collapse
                        root="comparison" addClasses={['RawJson', 'Comparison']} />
                </AccordionItem>
                <AccordionItem key="dataA" title={props.titles.a}>
                    <JsonBlock data={props.dataA} collapse
                        root="dataA" addClasses={['RawJson', 'DataA']} />
                </AccordionItem>
                <AccordionItem key="dataB" title={props.titles.b}>
                    <JsonBlock data={props.dataB} collapse
                        root="dataB" addClasses={['RawJson', 'DataB']} />
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default DiffDeploys;
