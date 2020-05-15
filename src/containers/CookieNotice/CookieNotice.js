import React, { Component } from 'react';

import Notice from '../../components/UI/Notice/Notice';
import CookieNoticeCookie from '../../storage/cookies/CookieNoticeCookie';
import Language from '../../utils/Language';

class CookieNotice extends Component {

    state = {
        showNotice: true,
        noticeAccepted: true,
        loaded_lang: false
    };

    lang = null;

    hideNotice = () => {
        this.setState({ showNotice: false });
    };

    acceptNotice = () => {
        CookieNoticeCookie.set(new Date());
        this.setState({ noticeAccepted: true, showNotice: false });
    };

    componentDidMount() {
        this.lang = {
            close_alt: Language.get('util_cancel_alt_text'),
            title: Language.get('cookie_notice_title'),
            message: Language.get('cookie_notice_message'),
            accept_button_text: Language.get('cookie_notice_accept_button_text'),
        };
        let newstate = { loaded_lang: true };
        let date = CookieNoticeCookie.get();
        if (date) {
            newstate.noticeAccepted = true;
            newstate.showNotice = false;
        }
        this.setState(newstate);
    }

    render() {
        if (!this.state.loaded_lang) {
            return null;
        }
        return (
            <Notice
                show={this.state.showNotice}
                closed={this.hideNotice}
                accepted={this.acceptNotice}
                lang={this.lang} />
        );
    }
}

export default CookieNotice;
