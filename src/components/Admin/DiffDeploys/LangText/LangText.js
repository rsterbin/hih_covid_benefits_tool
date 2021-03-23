import React from 'react';

const LangText = (props) => {
    let text = null;

    if (props.data) {
        if (props.dataKey in props.full.lang_keys) {
            const info = props.full.lang_keys[props.dataKey];
            if (info.markdown_allowed) {
                const md = require('markdown-it')();
                const markup = md.render(props.data);
                text = <div dangerouslySetInnerHTML={{__html: markup}}></div>
            } else {
                text = <p>{props.data}</p>
            }
        } else {
            text = <p>{props.data}</p>
        }
    }

    return text;
};

export default LangText;
