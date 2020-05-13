import React, { Component } from 'react';

import Notice from '../../components/UI/Notice/Notice';
import CookieNoticeCookie from '../../storage/cookies/CookieNoticeCookie';

class CookieNotice extends Component {

    state = {
        showNotice: true,
        noticeAccepted: true,
    };

    hideNotice = () => {
        this.setState({ showNotice: false });
    };

    acceptNotice = () => {
        CookieNoticeCookie.set(new Date());
        this.setState({ noticeAccepted: true, showNotice: false });
    };

    componentDidMount() {
        let date = CookieNoticeCookie.get();
        if (date) {
            this.setState({ noticeAccepted: true, showNotice: false });
        }
    }

    render() {
        return (
            <Notice
                title="Cookies on this site"
                message="We use cookies to keep your place in the flow of the benefit tool, and to collect answers as we go.  We store this data for research purposes, but it is fully anonymized. If you choose to give us your contact information, that is always stored separately from your answers and cannot be linked to them. This site does not use any third-party tracking tools."
                show={this.state.showNotice}
                closed={this.hideNotice}
                accepted={this.acceptNotice} />
        );
    }
}

export default CookieNotice;
