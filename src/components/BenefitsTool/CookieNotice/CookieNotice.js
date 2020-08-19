import React, { useState } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import { ACCEPT_ALL, REJECT_ALL } from '../../../logic/VisitorPrefs';

import './CookieNotice.css';

const CookieNotice = (props) => {
    const [current, setCurrent] = useState(props.prefs);
    const [simpleView, setSimpleView] = useState(true);

    if (!props.show) {
        return null;
    }

    let view = null;

    if (simpleView) {

        const doConfigure = (e) => { e.preventDefault(); setCurrent(REJECT_ALL); setSimpleView(false); };
        const doReject = () => { props.saved(REJECT_ALL); };
        const doAccept = () => { props.saved(ACCEPT_ALL); };

        view = (
            <div className="NoticeContent">
                <div className="NoticeMessage">
                    <h6>{props.lang.title}</h6>
                    <div dangerouslySetInnerHTML={{__html: props.lang.message_simple}}></div>
                </div>
                <div className="SimpleChoices">
                    <div className="Configure">
                        <a href="#detailView" className="ConfigureLink" onClick={doConfigure}>{props.lang.configure_link_text}</a>
                    </div>
                    <div className="NoticeButtons">
                        <button className="AcceptButton" onClick={doAccept}>{props.lang.accept_button_text}</button>
                        <button className="RejectButton" onClick={doReject}>{props.lang.reject_button_text}</button>
                    </div>
                </div>
            </div>
        );

    } else {

        const doSave = () => { props.saved(current); };
        const swapToggle = (key) => {
            let newVals = { ...current };
            newVals[key] = !newVals[key];
            setCurrent(newVals);
        };

        const controls = props.settings.map(opt => {
            let control = null;
            if (opt.input === 'toggle') {
                control = <Toggle
                    name={opt.key}
                    value="1"
                    id={opt.key}
                    aria-labelledby={opt.key + '_label'}
                    onChange={() => swapToggle(opt.key) }
                    checked={current ? current[opt.key] : false} />;
            } else if (opt.input === 'always') {
                control = <Toggle
                    name={opt.key}
                    value="1"
                    id={opt.key}
                    aria-labelledby={opt.key + '_label'}
                    checked disabled />;
            }
            return (
                <div className="CookieSetting" key={opt.key}>
                    <label htmlFor={opt.key} id={opt.key + '_label'}>{opt.label}</label>
                    <div className="OptDescription" dangerouslySetInnerHTML={{__html: opt.description}}></div>
                    <div className="OptControl">{control}</div>
                </div>
            );
        });

        view = (
            <div className="NoticeContent">
                <div className="NoticeMessage">
                    <h6>{props.lang.title}</h6>
                    <div dangerouslySetInnerHTML={{__html: props.lang.message_detailed}}></div>
                </div>
                <div className="NoticeControls">
                    {controls}
                </div>
                <div className="NoticeButtons">
                    <button className="SaveButton" onClick={doSave}>{props.lang.save_button_text}</button>
                </div>
            </div>
        );

    }

    const doClose = () => {
        if (simpleView) {
            props.saved(ACCEPT_ALL);
        } else {
            props.saved(current);
        }
    };

    return (
        <div className="CookieNotice">
            <button className="CloseNotice" onClick={doClose}><i className="fas fa-times" title="{props.lang.close_alt}"></i></button>
            {view}
        </div>
    );
};

export default CookieNotice;
