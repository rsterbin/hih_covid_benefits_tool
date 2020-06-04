import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import Form from '../../../../components/Admin/Form/Form';
import Element from '../../../../components/Admin/Form/Element/Element';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';
import Language from '../../../../utils/Language';

class AdminLanguageEdit extends Component {

    state = {
        loaded: false,
        error: null,
        language_info: null,
        original_english: null,
        english: null,
        processing: false,
        processing_error: null,
        saved: false
    };

    md = null;

    refresh = () => {
        this.fetchInfo();
    };

    changeEnglish = (e) => {
        let val = e.target.value;
        this.setState({ english: val });
    };

    submitEdit = () => {
        this.setState({
            processing: true,
            saved: false,
            processing_error: null
        });
        const data = {
            token: this.props.token,
            key: this.getKey(),
            language: 'en',
            translation: this.state.english
        };
        Api.saveTranslation(data)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    processing: false,
                    processing_error: false,
                    saved: true
                });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not save language', { api_error: Api.parseAxiosError(error), key: this.getKey() });
                this.setState({
                    processing: false,
                    processing_error: 'Could not save language'
                });
            });
    };

    componentDidMount() {
        this.md = require('markdown-it')();
        this.fetchInfo();
    }

    fetchInfo() {
        this.setState({ loaded: false, error: null });
        const data = { token: this.props.token, key: this.getKey() };
        Api.getLanguageInfo(data)
            .then((response) => {
                this.setState({
                    loaded: true,
                    language_info: response.data.info,
                    original_english: response.data.en,
                    english: response.data.en
                });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch language info', { api_error: Api.parseAxiosError(error), key: this.getKey() });
                this.setState({ error: 'Could not fetch language info' });
            });
    }

    getKey() {
        if (this.props.match.params.key) {
            return this.props.match.params.key;
        }
        return null;
    }

    render() {
        let body = null;
        if (!this.state.loaded) {
            body = (
                <Aux>
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );

        } else {
            let helptext = this.md.render(this.state.language_info.help);
            let helpbox = (
                <Aux>
                    <p><i>Appears in: <strong>{this.state.language_info.section}</strong></i></p>
                    {helptext ?
                        <div dangerouslySetInnerHTML={{__html: helptext}} />
                    : null}
                </Aux>
            );
            let label = 'English text for: ' + this.getKey();
            let input = null;
            let elem_class = null;
            if (this.state.language_info.markdown_allowed) {
                elem_class = 'Markdown';
                input = <EditMarkdown
                    name="english"
                    value={this.state.english}
                    changed={this.changeEnglish}
                    replace_token={this.state.language_info.token_replace}
                    replace_options={Language.get_token_options(this.state.language_info.token_replace)} />
            } else {
                elem_class = 'PlainText';
                input = <input type="text"
                    size="50"
                    name="english"
                    value={this.state.english}
                    onChange={this.changeEnglish} />
            }
            body = (
                <Form help={helpbox}
                    success={this.state.saved ? 'The new language has been saved' : null}
                    error={this.state.processing_error}
                    valid={true}
                    processing={this.state.processing}
                    submitted={this.submitEdit}>
                    <Element add_class={elem_class} label={label}>
                        {input}
                    </Element>
                </Form>
            );
        }

        return (
            <AdminPage
                title="Language: Edit language for the tool"
                breadcrumbs={['Admin', 'Language', 'Edit']}>
                {body}
            </AdminPage>
        );
    }
}

export default withRouter(AdminLanguageEdit);
