import React, { useState } from 'react';

import './TranslatedText.css';

const TranslatedText = (props) => {

    const [showKey, setShowKey] = useState(false);

    if (props.lang_key in props.translations
        && props.translations[props.lang_key] !== null
        && props.translations[props.lang_key].length > 0) {
        const classes = [ 'TranslatedText' ];
        if (showKey) {
            classes.push('ShowKey');
        } else {
            classes.push('HideKey');
        }
        return (
            <div className={classes.join(' ')} onClick={() => showKey ? setShowKey(false) : setShowKey(true)}>
                <span className="TranslationEn" key="en">{props.translations[props.lang_key]}</span>
                <span className="TranslationKey" key="key">{props.lang_key}</span>
            </div>
        );
    } else {
        return <div className="TranslatedText KeyOnly">{props.lang_key}</div>;
    }

};

export default TranslatedText;
