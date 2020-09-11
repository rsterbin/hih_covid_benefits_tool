import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import EditMarkdown from '../../../../components/Admin/EditMarkdown/EditMarkdown';
import Form from '../../../../components/Admin/Form/Form';
import Element from '../../../../components/Admin/Form/Element/Element';
import Logger from '../../../../utils/Logger';
import Language from '../../../../utils/Language';
import * as actions from '../../../../storage/redux/actions/index';

class AdminLanguageEdit extends Component {

    md = null;

    refresh = () => {
        this.props.fetchInfo();
    };

    changeEnglish = (e) => {
        this.props.holdText(e.target.value);
    };

    submitEdit = () => {
        this.props.saveText();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Language/Edit');
        this.md = require('markdown-it')();
        this.props.fetchInfo(this.getKey());
    }

    getKey() {
        if (this.props.match.params.key) {
            return this.props.match.params.key;
        }
        return null;
    }

    render() {
        Logger.setComponent('Admin/Language/Edit');
        let body = null;
        if (!this.props.info.loaded) {
            body = (
                <Aux>
                    {this.props.info.error ?
                        <Message type="error" text={this.props.info.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );

        } else {
            let helptext = this.md.render(this.props.info.data.help);
            let helpbox = (
                <Aux>
                    <p><i>Appears in: <strong>{this.props.info.data.section}</strong></i></p>
                    {helptext ?
                        <div dangerouslySetInnerHTML={{__html: helptext}} />
                    : null}
                </Aux>
            );
            let label = 'English text for: ' + this.getKey();
            let input = null;
            let elem_class = null;
            if (this.props.info.data.markdown_allowed) {
                elem_class = 'Markdown';
                input = <EditMarkdown
                    name="english"
                    value={this.props.current.text}
                    changed={this.changeEnglish}
                    replace_token={this.props.language_info.token_replace}
                    replace_options={Language.get_token_options(this.props.info.data.token_replace)} />
            } else {
                elem_class = 'PlainText';
                input = <input type="text"
                    size="50"
                    name="english"
                    value={this.props.current.text}
                    onChange={this.changeEnglish} />
            }
            body = (
                <Form help={helpbox}
                    success={this.props.save.saved ? 'The new language has been saved' : null}
                    error={this.props.save.error}
                    valid={true}
                    processing={this.props.save.processing}
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

const mapStateToProps = state => {
    return {
        info: {
            loaded: state.admin.language.info.loaded,
            error: state.admin.language.info.error,
            data: state.admin.language.info.data,
        },
        current: {
            key: state.admin.language.current.key,
            lang: state.admin.language.current.lang,
            text: state.admin.language.current.text
        },
        save: {
            processing: state.admin.language.save.processing,
            error: state.admin.language.save.error,
            saved: state.admin.language.save.saved
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchInfo: (key) => dispatch(actions.loadLangInfo(key)),
        holdText: (text) => dispatch(actions.adminHoldLangEditingText(text)),
        saveText: () => dispatch(actions.saveLangInfo()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminLanguageEdit));
