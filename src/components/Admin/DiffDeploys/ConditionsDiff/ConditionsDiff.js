import React from 'react';

import Tabs from '../../../UI/Tabs/Tabs';
import Tab from '../../../UI/Tabs/Tab/Tab';
import BasicDiff from '../BasicDiff/BasicDiff';
import OneCondition from './OneCondition/OneCondition';
import { getBenefitTitle, normalizeListDiff } from '../../../../utils/comparisons';

import './ConditionsDiff.css';

const conditionsDiff = (props) => {
    let sections = [];
    if ('diff' in props.cmp && typeof props.cmp.diff === 'object') {
        sections = Object.keys(props.cmp.diff).sort();
    }
    let tabs = [];
    const benefitsA = 'benefits' in props.full.dataA ? props.full.dataA.benefits.spec : {};
    const benefitsB = 'benefits' in props.full.dataB ? props.full.dataB.benefits.spec : {};
    for (const code of sections) {
        const title = getBenefitTitle(code, benefitsA, benefitsB);
        const dataA = code in props.dataA ? props.dataA[code] : [];
        const dataB = code in props.dataB ? props.dataB[code] : [];
        const rawDiff = props.cmp.diff[code];
        const diff = normalizeListDiff(rawDiff, dataA, dataB);
        tabs.push(
            <Tab key={code} title={title}>
                <h3>{title}</h3>
                <BasicDiff
                    full={props.full}
                    cmp={diff}
                    dataA={dataA}
                    dataB={dataB}
                    titles={props.titles}
                    interiorComponent={OneCondition} />
            </Tab>
        );
    }
    return (
        <div className="ConditionsDiff">
            <Tabs>
              {tabs}
            </Tabs>
        </div>
    );
};

export default conditionsDiff;
