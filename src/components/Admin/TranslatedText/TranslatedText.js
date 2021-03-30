import React, { useState } from 'react';

import Markdown from '../../../utils/Markdown';

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
        const english = props.translations[props.lang_key];
        let elemEn = null;
        if (props.markdown) {
            const markup = Markdown.render(english || '');
            elemEn = <div className="TranslationEn" key="en" dangerouslySetInnerHTML={{__html: markup}}></div>;
            classes.push('Markdown');
        } else {
            elemEn = <span className="TranslationEn" key="en">{english}</span>;
        }
        return (
            <div className={classes.join(' ')} onClick={() => showKey ? setShowKey(false) : setShowKey(true)}>
                {elemEn}
                <span className="TranslationKey" key="key">{props.lang_key}</span>
            </div>
        );
    } else {
        return <div className="TranslatedText KeyOnly">{props.lang_key}</div>;
    }

};

export default TranslatedText;
