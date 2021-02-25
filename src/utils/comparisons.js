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

