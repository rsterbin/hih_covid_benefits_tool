import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import ProcessingButton from '../../../../components/UI/ProcessingButton/ProcessingButton';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import './Edit.css';

class AdminLanguageEdit extends Component {

    state = {
        loaded: false,
        error: null,
        language_info: null,
        original_english: null,
        preview: false,
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

    doPreview = () => {
        this.setState({ preview: true });
    };

    doEdit = () => {
        this.setState({ preview: false });
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
            english: this.state.english
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
            let help = this.md.render(this.state.language_info.help);
            body = (
                <div className="EditLanguage">
                    <h4>Editing: {this.getKey()}</h4>
                    <p><i>Appears in: <strong>{this.state.language_info.section}</strong></i></p>
                    <div dangerouslySetInnerHTML={{__html: help}} />
                    <form method="post" onSubmit={this.submitEdit}>
                        {this.state.language_info.markdown_allowed ?
                            <EditMarkdown
                                name="english"
                                previewing={this.state.preview}
                                value={this.state.english}
                                clickedEdit={this.doEdit}
                                clickedPreview={this.doPreview}
                                changed={this.changeEnglish} />
                        :
                            <input type="text"
                                name="english"
                                value={this.state.english}
                                onChange={this.changeEnglish} />
                        }
                        {this.state.preview ? null :
                            <div className="ButtonHolder">
                                <ProcessingButton
                                    working={this.state.processing}
                                    clicked={this.submitEdit}
                                    text="Submit" />
                            </div>
                        }
                        {this.state.saved ?
                            <Message type="success" text="The new language has been saved" />
                        : null}
                        {this.state.processing_error ?
                            <Message type="error" text={this.state.processing_error} />
                        : null}
                    </form>
                </div>
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
