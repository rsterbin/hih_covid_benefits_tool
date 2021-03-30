import { schemeSet3, schemeGreys } from 'd3-scale-chromatic';
import { shuffle } from './utils';

export const statsToChartData = (stats) => {
    if (typeof stats != 'object') {
        stats = {};
    }
    const cdata = [];
    let scheme = [];
    for (let i = 0; i < 12; ++i) {
        scheme.push(schemeSet3[i]);
    }
    if (Object.keys(stats).length > scheme.length) {
        const count = Object.keys(stats).length - scheme.length;
        const extraScheme = schemeGreys[count + 2];
        for (let k = 0; k < count; ++k) {
            scheme.push(extraScheme[k]);
        }
    }
    const schemeRandom = shuffle(scheme);
    let idx = 0;
    for (const key in stats) {
        cdata.push({
            id: key,
            label: key,
            value: stats[key],
            color: schemeRandom[idx++],
        });
    }
    if (cdata.length < 1) {
        cdata.push({
            id: 'NO DATA',
            label: 'NO DATA',
            value: 1
        });
    }
    return cdata;
};

