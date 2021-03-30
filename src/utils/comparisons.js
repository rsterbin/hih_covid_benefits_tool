import React from 'react';

import TranslatedText from '../components/Admin/TranslatedText/TranslatedText';

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

export const complexOrSimpleData = (props, pkey = null) => {
    let mydata = null;

    // Passed directly (for a_version/b_version)
    if ('data' in props) {
        mydata = props.data;

    // Need to pull from data (for partial diff)
    } else if ('section' in props) {
        // Fake spec+order objects
        if (Array.isArray(props.section)) {
            if (pkey !== null) {
                for (const elem of props.section) {
                    if (pkey in elem && elem[pkey] === props.dataKey) {
                        mydata = elem;
                        break;
                    }
                }
            }
        } else if ('dataKey' in props) {
            // Spec+order objects
            if ('spec' in props.section && props.dataKey in props.section.spec) {
                mydata = props.section.spec[props.dataKey];

            // Simple objects
            } else if (props.dataKey in props.section) {
                mydata = props.section[props.dataKey];
            }
        }
    }

    // Partial diff: highlight differences
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

export const normalizeListDiff = (rawDiff, dataA, dataB, listKey) => {
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
            diff.order_diff[marker].push(item[listKey]);
            diff.diff[item[listKey]] = {
                a_version: null,
                b_version: null,
            };
            diff.diff[item[listKey]][marker] = item;
        }
    }
    return diff;
};

export const getTranslationWrapper = (full, markdown = false) => {
    let lang_text = {};
    if ('lang_en' in full && typeof full.lang_en === 'object') {
        lang_text = full.lang_en;
    }
    const wrap = (lang_key) => {
        return <TranslatedText lang_key={lang_key} translations={lang_text} markdown={markdown} />
    };
    return wrap;
};

export const getPairWrapper = (highlight, mydata) => {
    const wrap = (pair) => {
        const mt = getMatchType(pair.key, highlight);
        if (mt) {
            pair.matchType = mt;
        }
        if (!(pair.key in mydata)) {
            pair.missing = true;
        }
        return pair;
    };
    return wrap;
};

