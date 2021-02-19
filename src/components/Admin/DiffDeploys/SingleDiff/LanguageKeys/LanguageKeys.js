import React, { useState } from 'react';

import './LanguageKeys.css';

const LanguageKeys = (props) => {

    let keys = Object.keys(props.cmp.diff);
    keys.sort();

    const [openKey, setOpenKey] = useState(null);
    const [showRaw, setShowRaw] = useState(null);

    let content = null;
    if (showRaw === 'rawA' || showRaw === 'rawB') {

        const title = showRaw === 'rawA' ? props.titles.a : props.titles.b;
        const style = { color: showRaw === 'rawA' ? 'blue' : 'green' };
        content = (
            <div className="RawData">
                <div className="RawTitle">
                    <span>{title}</span>
                    <button className="mockLink CloseRaw" onClick={() => setShowRaw(null)}>(close)</button>
                </div>
                <div className="RawBody">
                    <pre style={style}>{JSON.stringify(props.dataA, null, 2)}</pre>
                </div>
            </div>
        );

    } else {

        let lines = [];

        const makeTitle = (text, which) => {
            return (
                <div className="SideTitle">
                    <span>{text}</span>
                    <button className="mockLink OpenRaw" onClick={() => setShowRaw(which)}>(raw)</button>
                </div>
            );
        };

        lines.push(
            <div className="LangLine HeaderOnly" key="--header-only">
                <div className="ASide">
                    {makeTitle(props.titles.a, 'rawA')}
                </div>
                <div className="BSide">
                    {makeTitle(props.titles.b, 'rawB')}
                </div>
            </div>
        );

        const md = require('markdown-it')();
        const makeSide = (key, version, isOpen) => {
            let interior = {
                handle: null,
                body: null,
            };
            if (version === null) {
                interior.handle = <span>empty</span>;
            } else {
                if (isOpen) {
                    let help = null;
                    if (version.help) {
                        const markup = md.render(version.help);
                        help = <dd key="help-text" dangerouslySetInnerHTML={{__html: markup}}></dd>
                    } else {
                        help = <dd key="help-text"><span class="empty">none</span></dd>
                    }
                    let tokens = null;
                    if (version.token_replace) {
                        tokens = <dd key="token_replace-text">{version.token_replace}</dd>;
                    } else {
                        tokens = <dd key="token_replace-text"><span class="empty">none</span></dd>;
                    }
                    interior.body = (
                        <dl>
                            <dt key="section-label">Section</dt>
                            <dd key="section-text">{version.section}</dd>
                            <dt key="help-label">Help</dt>
                            {help}
                            <dt key="token_replace-label">Tokens that can be replaced:</dt>
                            {tokens}
                            <dt key="markdown_allowed-label">Is markdown allowed?</dt>
                            <dd key="markdown_allowed-text">{version.markdown_allowed ? 'Yes' : 'No'}</dd>
                        </dl>
                    );
                }
                interior.handle = key;
            }
            return interior;
        };

        for (const key of keys) {
            const item = props.cmp.diff[key];

            let classes = [ 'LangLine' ];
            let clicked = null;
            let aside = makeSide(key, item.a_version, openKey === key);
            let bside = makeSide(key, item.b_version, openKey === key);

            if (item.a_version === null) {
                classes.push('AMissing');
            } else if (item.b_version === null) {
                classes.push('BMissing');
            } else {
                classes.push('Diff');
            }

            if (key === openKey) {
                classes.push('Open');
                clicked = () => setOpenKey(null);
            } else {
                classes.push('Closed');
                clicked = () => setOpenKey(key);
            }

            let handleClasses = [...classes];
            handleClasses.push('HandleRow');
            lines.push(
                <div className={handleClasses.join(' ')} key={key + '-handle'} onClick={clicked}>
                    <div className="ASide">
                        {aside.handle}
                    </div>
                    <div className="BSide">
                        {bside.handle}
                    </div>
                </div>
            );

            let bodyClasses = [...classes];
            bodyClasses.push('BodyRow');
            lines.push(
                <div className={bodyClasses.join(' ')} key={key + '-body'}>
                    <div className="ASide">
                        {aside.body}
                    </div>
                    <div className="BSide">
                        {bside.body}
                    </div>
                </div>
            );
        }

        content = (
            <div className="LangTable">
                {lines}
            </div>
        );
    }

    return (
        <div className="LanguageKeys">
            {content}
        </div>
    );

};

export default LanguageKeys;
