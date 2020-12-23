import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

import AdminPage from '../../../hoc/AdminPage/AdminPage';
import Aux from '../../../hoc/Aux/Aux';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Table from '../../../components/UI/Table/Table';
import Message from '../../../components/UI/Message/Message';
import ActionButtons from '../../../components/Admin/ActionButtons/ActionButtons';
import Api from '../../../storage/Api';
import Questions from '../../../logic/Questions';
import Logger from '../../../utils/Logger';
import * as actions from '../../../storage/redux/actions/index';

class AdminResponses extends Component {

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
        this.props.fetch();
    };

    componentDidMount() {
        Logger.setComponent('Admin/Responses/List');
        this.props.fetch();
    }

    render() {
        Logger.setComponent('Admin/Responses/List');
        let body = null;
        if (this.props.loaded) {
            let cols = [
                { key: 'date', title: 'Date' },
            ];
            const rows = this.props.data.map(row => {
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
            const url = Api.getResponsesDownloadUrl(this.props.token);
            const now = DateTime.local();
            const filename = 'hnct-' + now.toISODate() + '-responses.csv';
            body = (
                <Aux>
                    <ActionButtons buttons={[{icon: "fas fa-download",
                        title: 'Download',
                        link: url,
                        download: filename}]} />
                    <Table rows={rows} cols={cols}
                        toggle_cols={this.toggle_cols}
                        toggle_expand_title="show all answers"
                        toggle_collapse_title="show fewer answers" />
                </Aux>
            );
        } else {
            body = (
                <Aux>
                    {this.props.error ?
                        <Message type="error" text={this.props.error} tryagain={this.refresh} />
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

const mapStateToProps = state => {
    return {
        token: state.admin.auth.token,
        loaded: state.admin.responses.loaded,
        error: state.admin.responses.error,
        data: state.admin.responses.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetch: () => dispatch(actions.loadResponses()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminResponses);
