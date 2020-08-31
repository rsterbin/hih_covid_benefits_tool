import React, { Component } from 'react';
import { DateTime } from 'luxon';

import AdminPage from '../../../hoc/AdminPage/AdminPage';
import Aux from '../../../hoc/Aux/Aux';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Table from '../../../components/UI/Table/Table';
import Message from '../../../components/UI/Message/Message';
import ActionButtons from '../../../components/Admin/ActionButtons/ActionButtons';
import Api from '../../../storage/Api';
import Questions from '../../../logic/Questions';
import Logger from '../../../utils/Logger';

class AdminResponses extends Component {

    state = {
        loaded: false,
        error: null,
        responses: null,
        processing: false
    };

    toggle_cols = {
        'hours per week': true,
        'length of employment': true,
        'hours per year': true,
        'self-quarantine': true,
        'family quarantine': true,
        'stay at home': true,
        'school closed': true,
    };

    refresh = () => {
        this.fetchResponses();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Responses/List');
        this.fetchResponses();
    }

    fetchResponses() {
        this.setState({ loaded: false, responses: null, error: null });
        const data = { token: this.props.token };
        Api.getAllResponses(data)
            .then((response) => {
                const all = response.data.all ? response.data.all : [];
                this.setState({ loaded: true, responses: all });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch responses', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch responses' });
            });
    }

    render() {
        Logger.setComponent('Admin/Responses/List');
        let body = null;
        if (this.state.loaded) {
            let cols = [
                { key: 'date', title: 'Date' },
            ];
            const rows = this.state.responses.map(row => {
                let tablerow = {
                    key: row.response_id
                };
                const do_cols = cols.length < 2;
                for (var qcode of Questions.question_order) {
                    const spec = Questions.getEnglishSpec(qcode);
                    if (do_cols) {
                        cols.push({
                            key: qcode,
                            title: spec.title
                        });
                    }
                    tablerow[qcode] = row[qcode];
                }
                let dt = DateTime.fromISO(row.submitted);
                let formatted = dt.toFormat('LLL dd');
                tablerow.date = formatted;
                return tablerow;
            });
            body = (
                <Aux>
                    <ActionButtons buttons={[{icon: "fas fa-download",
                        title: "Download",
                        link: Api.getResponsesDownloadUrl(this.props.token) }]} />
                    <Table rows={rows} cols={cols}
                        toggle_cols={this.toggle_cols}
                        toggle_expand_title="show all answers"
                        toggle_collapse_title="show fewer answers" />
                </Aux>
            );
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
        let title = 'Responses';
        let crumbs = ['Admin', 'Responses', 'List'];
        return (
            <AdminPage
                title={title}
                breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }
}

export default AdminResponses;
