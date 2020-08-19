import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import CookieNotice from '../../components/BenefitsTool/CookieNotice/CookieNotice';
import Landing from './Landing/Landing';
import Quiz from './Quiz/Quiz';
import Confirmation from './Confirmation/Confirmation';
import Results from './Results/Results';
import Disclaimer from './Disclaimer/Disclaimer';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import Language from '../../utils/Language';
import VisitorPrefs from '../../logic/VisitorPrefs';
import * as actions from '../../storage/redux/actions/index';

class BenefitsTool extends Component {

    componentDidMount() {
        this.props.fetchVisitor();
        this.props.fetchAnswers();
    }

    render() {

        if (!this.props.loaded) {
            return <Spinner />;
        }

        const lang = {
            cookie_notice: {
                close_alt: Language.get('util_cancel_alt_text'),
                title: Language.get('cookie_notice_title'),
                message_simple: Language.get('cookie_notice_message'),
                configure_link_text: Language.get('cookie_notice_configure_link_text'),
                reject_button_text: Language.get('cookie_notice_reject_button_text'),
                accept_button_text: Language.get('cookie_notice_accept_button_text'),
                message_detailed: Language.get('cookie_notice_message_detailed'),
                save_button_text: Language.get('cookie_notice_save_button_text')
            }
        };

        const settings = VisitorPrefs.options.map(opt => {
            return { ...opt,
                label: Language.get(opt.title_lang_key),
                description: Language.get(opt.desc_lang_key)
            };
        });

        return (
            <div className="BenefitsTool">
                <Switch>
                    <Route path="/quiz/:step" component={Quiz} />
                    <Route path="/quiz" component={Quiz} />
                    <Route path="/confirm" component={Confirmation} />
                    <Route path="/results" component={Results} />
                    <Route path="/disclaimer" component={Disclaimer} />
                    <Route path="/privacy-policy" component={PrivacyPolicy} />
                    <Route path="/" component={Landing} />
                </Switch>
                <CookieNotice
                    show={this.props.show_cookie_notice}
                    settings={settings}
                    prefs={this.props.visitor_prefs}
                    saved={(prefs) => this.props.saveCookiePrefs(prefs) }
                    lang={lang.cookie_notice} />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        loaded: state.loaded,
        visitor_id: state.visitor_id,
        visitor_prefs: state.visitor_prefs,
        show_cookie_notice: state.visitor_prefs === null ? true : false,
        answers: state.answers
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchVisitor: () => dispatch(actions.visitorFetch()),
        fetchAnswers: () => dispatch(actions.answersFetch()),
        saveCookiePrefs: (prefs) => dispatch(actions.cookiePrefsSave(prefs)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BenefitsTool);
