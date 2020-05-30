import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Table from '../../../../components/UI/Table/Table';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminResultsList extends Component {

    state = {
        loaded: false,
        benefits: null,
        error: null
    };

    componentDidMount() {
        this.fetchBenefits();
    }

    fetchBenefits() {
        this.setState({ loaded: false, benefits: null, error: null });
        const data = { token: this.props.token };
        Api.getBenefits(data)
            .then((response) => {
                const benefits = response.data.benefits ? response.data.benefits : [];
                this.setState({ loaded: true, benefits: benefits });
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch benefits', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch benefits' });
            });
    }

    cols = [
        { key: 'name', title: 'Name' },
        { key: 'abbreviation', title: 'Abbreviation' },
        { key: 'manage', title: 'Manage' }
    ];

    clickable = {
        manage: (row) => { this.manageBenefit(row); }
    };

    manageBenefit(row) {
        this.props.history.push('/admin/results/' + row.code);
    }

    render() {
        let body = null;
        if (this.state.loaded) {
            let rows = this.state.benefits
                .sort()
                .map(benefit => {
                    return {
                        code: benefit.code,
                        name: benefit.name,
                        abbreviation: benefit.abbreviation,
                        manage: <i className="fas fa-cog" title="Manage"></i>,
                    };
                });
            console.log(rows);
            body = (
                <Table
                    rows={rows}
                    cols={this.cols}
                    clickable={this.clickable} />
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
        return (
            <AdminPage
                title="Results: Manage results by benefit"
                breadcrumbs={['Admin', 'Results', 'List']}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminResultsList);
