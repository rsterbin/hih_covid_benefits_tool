import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminResultsEdit extends Component {

    state = {
        loaded: false,
        benefit: null,
        scenario: null,
        error: null
    };

    refresh = () => {
        this.fetchScenario();
    };

    componentDidMount() {
        this.fetchScenario();
    }

    fetchScenario() {
        this.setState({
            loaded: false,
            benefit: null,
            scenario: null,
            error: null
        });
        const data = { token: this.props.token };
        Api.getScenario(
                this.props.match.params.benefit,
                this.props.match.params.id,
                data
            )
            .then((response) => {
                if (!response.data.benefit || !response.data.scenario) {
                    this.setState({ error: 'That scenario is unknown' });
                } else {
                    const benefit = response.data.benefit;
                    const scenario = response.data.scenario;
                    this.setState({
                        loaded: true,
                        benefit: benefit,
                        scenario: scenario
                    });
                }
            })
            .catch((error) => {
                if (!error.isAxiosError) {
                    throw error;
                }
                Logger.alert('Could not fetch scenario', { api_error: Api.parseAxiosError(error) });
                this.setState({ error: 'Could not fetch scenario' });
            });
    }

    render() {
        let body = null;
        let title = 'Results: ';
        let crumbs = ['Admin', 'Results'];
        if (this.state.loaded) {
            title += this.state.benefit.abbreviation + ': Edit Scenario';
            crumbs.push(this.state.benefit.abbreviation);
            crumbs.push('Scenario');
            body = (
                <p>Hello, this is the edit page</p>
            );
        } else {
            title += 'Edit Scenario';
            crumbs.push('Scenario');
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
            <AdminPage title={title} breadcrumbs={crumbs}>
                {body}
            </AdminPage>
        );
    }

}

export default withRouter(AdminResultsEdit);
