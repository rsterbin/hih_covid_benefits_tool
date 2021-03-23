import React from 'react';

import Tabs from '../../../UI/Tabs/Tabs';
import Tab from '../../../UI/Tabs/Tab/Tab';
import BasicDiff from '../BasicDiff/BasicDiff';
import { getBenefitTitle, normalizeListDiff } from '../../../../utils/comparisons';

import './ResourcesDiff.css';

const resourcesDiff = (props) => {

    let sections = [];
    if ('diff' in props.cmp && typeof props.cmp.diff === 'object' &&
        'benefits' in props.cmp.diff && typeof props.cmp.diff.benefits === 'object' &&
        'diff' in props.cmp.diff.benefits && typeof props.cmp.diff.benefits.diff === 'object') {
        sections = Object.keys(props.cmp.diff.benefits.diff).sort();
    }

    let tabs = [];
    const benefitsA = 'benefits' in props.full.dataA ? props.full.dataA.benefits.spec : {};
    const benefitsB = 'benefits' in props.full.dataB ? props.full.dataB.benefits.spec : {};
    for (const code of sections) {
        const title = getBenefitTitle(code, benefitsA, benefitsB);
        const dataA = props.dataA && code in props.dataA.benefits ? props.dataA.benefits[code] : [];
        const dataB = props.dataB && code in props.dataB.benefits ? props.dataB.benefits[code] : [];
        const rawDiff = props.cmp.diff.benefits.diff[code];
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
                    interiorComponent={props.interiorComponent} />
            </Tab>
        );
    }

    if ('diff' in props.cmp && typeof props.cmp.diff === 'object' &&
        'other' in props.cmp.diff && typeof props.cmp.diff.other === 'object') {
        const title = 'Other';
        const dataA = props.dataA && 'other' in props.dataA ? props.dataA.other : [];
        const dataB = props.dataB && 'other' in props.dataB ? props.dataB.other : [];
        const rawDiff = props.cmp.diff.other;
        const diff = normalizeListDiff(rawDiff, dataA, dataB);
        tabs.push(
            <Tab key="other" title={title}>
                <h3>{title}</h3>
                <BasicDiff
                    full={props.full}
                    cmp={diff}
                    dataA={dataA}
                    dataB={dataB}
                    titles={props.titles}
                    interiorComponent={props.interiorComponent} />
            </Tab>
        );
    }

    return (
        <div className="ResourcesDiff">
            <Tabs>
              {tabs}
            </Tabs>
        </div>
    );

};

export default resourcesDiff;
