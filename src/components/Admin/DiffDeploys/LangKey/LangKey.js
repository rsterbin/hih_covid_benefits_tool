import React from 'react';

import './LangKey.css';

const LangKey = (props) => {

    let help = null;
    if (props.data.help) {
        const md = require('markdown-it')();
        const markup = md.render(props.data.help);
        help = <dd key="help-text" dangerouslySetInnerHTML={{__html: markup}}></dd>
    } else {
        help = <dd key="help-text"><span class="empty">none</span></dd>
    }

    let tokens = null;
    if (props.data.token_replace) {
        tokens = <dd key="token_replace-text">{props.data.token_replace}</dd>;
    } else {
        tokens = <dd key="token_replace-text"><span class="empty">none</span></dd>;
    }

    return (
        <div className="LangKey">
            <dl>
                <dt key="section-label">Section</dt>
                <dd key="section-text">{props.data.section}</dd>
                <dt key="help-label">Help</dt>
                {help}
                <dt key="token_replace-label">Tokens that can be replaced:</dt>
                {tokens}
                <dt key="markdown_allowed-label">Is markdown allowed?</dt>
                <dd key="markdown_allowed-text">{props.data.markdown_allowed ? 'Yes' : 'No'}</dd>
            </dl>
        </div>
    );

};

export default LangKey;
