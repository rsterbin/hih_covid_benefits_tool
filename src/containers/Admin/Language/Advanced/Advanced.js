import React, { Component } from 'react';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import ProcessingButton from '../../../../components/UI/ProcessingButton/ProcessingButton';
import RawTextBox from '../../../../components/UI/RawTextBox/RawTextBox';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

import EnglishData from '../../../../data/lang/en.json';
import KeysData from '../../../../data/lang/keys.json';

class AdminLanguageAdvanced extends Component {
    
    state = {
        processing: false,
        process_data: null,
        error: null
    };

    initDeploys = () => {
        this.setState({ processing: true, process_data: null, error: null });
        const data = {
            token: this.props.token,
            en: EnglishData,
            keys: KeysData
        };
        Api.initializeLanguage(data)
            .then(response => {
                this.setState({
                    processing: false,
                    process_data: JSON.stringify(response.data),
                    error: null
                });
            })
            .catch(error => {
                if (!error.isAxiosError) {
                    throw error;
                }
                const parsed = Api.parseAxiosError(error);
                Logger.alert('Could not initialize the language deploy', { api_error: parsed });
                this.setState({ processing: false, error: '[' + parsed.code + '] ' + parsed.message });
            });
    }

    render() {
        let emptytext = null;
        if (this.state.processing) {
            emptytext = 'processing...';
        } else {
            emptytext = 'Click Go to re-intitalize the translations...';
        }
        let boxContents = null;
        if (this.state.process_data) {
            boxContents = this.state.process_data;
        }
        return (
            <AdminPage
                title="Advanced: Set up the initial deploy"
                breadcrumbs={['Admin', 'Language', 'Advanced']}
                advanced={true}>
                <ProcessingButton
                    size="large"
                    working={this.state.processing}
                    clicked={() => { this.initDeploys(); }}
                    text="Go" />
                {this.state.error ?
                    <Message type="error" text={this.state.error} />
                : null}
                <RawTextBox contents={boxContents} emptytext={emptytext} />
            </AdminPage>
        );
    }
}

export default AdminLanguageAdvanced;
