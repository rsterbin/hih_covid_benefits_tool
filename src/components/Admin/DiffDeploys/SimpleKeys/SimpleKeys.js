import React from 'react';

import Aux from '../../../../hoc/Aux/Aux';

import './SimpleKeys.css';

const simpleKeys = (props) => {

    const pairs = props.pairs.map(pair => {
        let c = [];
        if ('matchType' in pair) {
            c.push('Highlight');
            if (pair.matchType === 'aMissing') {
                c.push('MissingA');
            } else if (pair.matchType === 'bMissing') {
                c.push('MissingB');
            } else {
                c.push('Diff');
            }
        }
        if (pair.addClass) {
            c.push(pair.addClass);
        }
        return (
            <Aux key={pair.key + '-trans'}>
                <dt key={pair.key + '-label'} className={c.join(' ')}>{pair.label}</dt>
                <dd key={pair.key + '-value'} className={c.join(' ')}>{pair.display}</dd>
            </Aux>
        )
    });

    return (
        <dl className="SimpleKeys">
            {pairs}
        </dl>
    );

};

export default simpleKeys;
