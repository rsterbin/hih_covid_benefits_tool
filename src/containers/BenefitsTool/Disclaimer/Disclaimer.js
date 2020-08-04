import React, { Component } from 'react';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Language from '../../../utils/Language';

class Disclaimer extends Component {

    state = {
        loaded_lang: false
    };

    lang = null;

    componentDidMount() {
        this.lang = {
            header: Language.get('disclaimer_header'),
            text: Language.get('disclaimer_text'),
        };
        this.setState({ loaded_lang: true });
    }

    render() {
        if (!this.state.loaded_lang) {
            return <Spinner />;
        }
        return (
            <div className="Disclaimer">
                <h2>{this.lang.header}</h2>
                <div dangerouslySetInnerHTML={{__html: this.lang.text}}></div>
            </div>
        );
    }
}

export default Disclaimer;
