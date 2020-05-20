import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Table from '../../../../components/UI/Table/Table';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

const MAX_KEY_LENGTH = 50;
const MAX_ENGLISH_LENGTH = 100;

class AdminLanguageList extends Component {
    
    state = {
        loaded: false,
        sections: null,
        error: null
    };

    cols = [
        { key: 'key', title: 'Key' },
        { key: 'english', title: 'English' },
    ];

    snip = {
        key: MAX_KEY_LENGTH,
        english: MAX_ENGLISH_LENGTH
    };

    clickable = {
        key: (row) => { this.editRow(row); }
    };

    refresh = () => {
        this.fetchLanguage();
    };

    editRow(row) {
        this.props.history.push('/admin/language/' + row.key);
    }

    componentDidMount() {
        this.fetchLanguage();
    }

    fetchLanguage() {
        this.setState({ loaded: false, sections: null, error: null });
        const data = { token: this.props.token };
        Api.getAllLanguage(data)
            .then((response) => {
                const all = response.data.all ? response.data.all : [];
                this.setState({ loaded: true, sections: all });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch language keys', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch language keys' });
            });
    }

    render() {
        let body = null;
        if (this.state.loaded) {
            let sections = Object.keys(this.state.sections)
                .sort()
                .map(section => {
                    const rows = this.state.sections[section].map(info => {
                        return {
                            key: info.key,
                            english: info.english
                        };
                    });
                    return (
                        <div key={section}>
                            <h4>{section}</h4>
                            <Table
                                rows={rows}
                                cols={this.cols}
                                clickable={this.clickable}
                                snip={this.snip} />
                        </div>
                    );
                });
            body = sections;
        } else {
            body = (
                <Aux>
                    {this.state.error ?
                        <Message type="error" text={this.state.error} tryagain={this.refresh} />
                    : null}
                    <Spinner />
                </Aux>
            );
        }
        return (
            <AdminPage
                title="Language: All language used in the user-facing site"
                breadcrumbs={['Admin', 'Language', 'List']}>
                {body}
            </AdminPage>
        );
    }
}

export default withRouter(AdminLanguageList);
