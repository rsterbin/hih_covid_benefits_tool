// These are all for the section Admin > Deploy > Compare

export const getMatchType = (pkey, section) => {
    if (section === null) {
        return false;
    }
    if (!(pkey in section)) {
        return false;
    }
    if ('match' in section[pkey] && 'diff' in section[pkey]) {
        return 'complexDiff';
    }
    if (section[pkey].a_version === null) {
        return 'aMissing';
    }
    if (section[pkey].b_version === null) {
        return 'bMissing';
    }
    return 'simpleDiff';
};

export const complexOrSimpleData = (props) => {
    let mydata = null;
    if ('data' in props) {
        mydata = props.data;
    }
    if ('section' in props && 'spec' in props.section && props.dataKey in props.section.spec) {
        mydata = props.section.spec[props.dataKey];
    }

    let highlight = null;
    if ('highlight' in props) {
        if ('match' in props.highlight && 'diff' in props.highlight) {
            highlight = props.highlight.diff;
        }
    }

    return [ mydata, highlight ];
};

export const getBenefitTitle = (code, benefitsA, benefitsB) => {
    let title = code;
    if (code in benefitsA && code in benefitsB) {
        const atitle = benefitsA[code].abbreviation;
        const btitle = benefitsB[code].abbreviation;
        if (!atitle || !btitle) {
            if (!atitle && !btitle) {
                // keep code
            } else if (!atitle) {
                title = btitle;
            } else {
                title = atitle;
            }
        } else if (atitle === btitle) {
            title = atitle;
        } else {
            title = atitle + ' / ' + btitle;
        }
    } else if (code in benefitsB) {
        title = benefitsB[code].abbreviation;
    } else if (code in benefitsA) {
        title = benefitsA[code].abbreviation;
    }
    return title;
};

export const normalizeListDiff = (rawDiff, dataA, dataB) => {
    let diff = rawDiff;
    if (!('diff' in rawDiff)) {
        diff = {
            order_match: false,
            order_diff: {
                a_version: [],
                b_version: [],
            },
            match: false,
            diff: {}
        };
        const av = rawDiff.a_version;
        const bv = rawDiff.b_version;
        let list = [];
        let marker = 'a_version';
        if (av === null && bv !== null) {
            list = dataB;
            marker = 'b_version';
        } else if (bv === null && av !== null) {
            list = dataA;
        }
        if (!Array.isArray(list)) {
            list = [ list ];
        }
        for (const item of list) {
            diff.order_diff[marker].push(item.code);
            diff.diff[item.code] = {
                a_version: null,
                b_version: null,
            };
            diff.diff[item.code][marker] = item;
        }
    }
    return diff;
};

