import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Response from '../../../components/BenefitsTool/Response/Response';
import Controls from '../../../components/UI/Controls/Controls';
import Language from '../../../utils/Language';
import CollectResults from '../../../logic/CollectResults';

import CtaData from '../../../data/cta.json';

const CTA_TRACKING_CODE = '?utm_source=hih-covid-quiz';

class Results extends Component {

    state = {
        loaded_lang: false
    };

    lang = null;

    clickCTAButton = (link) => {
        window.open(link + CTA_TRACKING_CODE, '_blank');
    };

    componentDidMount() {
        this.lang = {
            restart_link_text: Language.get('util_restart_link_text'),
            read_less: Language.get('util_read_less_link_text'),
            read_more: Language.get('util_read_more_link_text')
        };
        this.setState({ loaded_lang: true });
    }

    render() {

        if (!this.state.loaded_lang) {
            return <Spinner />;
        }

        const goto = this.props.needsRedirect();
        if (goto) {
            return <Redirect to={goto} />;
        }

        const results = CollectResults.compile(this.props.answers);

        let ctas = [];
        if (CtaData.length > 3) {
            for (let i = 0; i < 3; i++) {
                const r = CtaData[Math.floor(Math.random() * CtaData.length)];
                ctas.push(r);
            }
        } else {
            ctas = CtaData;
        }
        const buttons = ctas.map((cta) => {
            return {
                classNames: [ 'CTAButton' ],
                clicked: () => { this.clickCTAButton(cta.link); },
                text: Language.get(cta.text),
                title: Language.get(cta.title)
            };
        });

        const links = [
            {
                classNames: [ 'RestartLink' ],
                clicked: () => { this.props.history.push('/') },
                text: this.lang.restart_link_text
            }
        ];

        return (
            <div className="Results">
                <Response
                    header={results.header}
                    answerSections={results.sections}
                    resources_header={results.resources_header}
                    resources_intro={results.resources_intro}
                    resources={results.resources}
                    lang={this.lang} />
                <Controls
                    buttons={buttons}
                    links={links} />
            </div>
        );
    }

}

export default withRouter(Results);
