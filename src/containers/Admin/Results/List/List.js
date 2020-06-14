import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Table from '../../../../components/UI/Table/Table';
import IconButton from '../../../../components/UI/IconButton/IconButton';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminResultsList extends Component {

    state = {
        loaded: false,
        benefits: null,
        language: null,
        error: null
    };

    cols = [
        { key: 'name', title: 'Name' },
        { key: 'abbreviation', title: 'Abbreviation' },
        { key: 'scenarios', title: 'Scenarios' },
        { key: 'resources', title: 'Resources' }
    ];

    clickable = {
        scenarios: (row) => { this.editScenarios(row); },
        resources: (row) => { this.editResources(row); }
    };

    refresh = () => {
        this.fetchBenefits();
    };

    editCommonResources = () => {
        this.props.history.push('/admin/resources/common');
    };

    editCommonLanguage = () => {
        this.props.history.push('/admin/language/results');
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

    editScenarios(row) {
        this.props.history.push('/admin/results/' + row.code);
    }

    editResources(row) {
        this.props.history.push('/admin/resources/' + row.code);
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
                        scenarios: <i className="fas fa-align-justify" title="Edit Scenarios"></i>,
                        resources: <i className="fas fa-link" title="Resources"></i>,
                    };
                });
            body = (
                <Aux>
                    <h3>Results By Benefit</h3>
                    <Table
                        rows={rows}
                        cols={this.cols}
                        clickable={this.clickable} />
                    <div className="Extras">
                        <h3>Non-Benefit Related Results</h3>
                        <p><IconButton icon="fas fa-align-justify"
                            title="Language"
                            append_text="Common Language"
                            clicked={this.editCommonResources} /></p>
                        <p><IconButton icon="fas fa-link"
                            title="Resources"
                            append_text="Common Resources"
                            clicked={this.editCommonResources} /></p>
                    </div>
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
        return (
            <AdminPage
                title="Results: Manage the Results Page"
                breadcrumbs={['Admin', 'Results', 'List']}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminResultsList);
