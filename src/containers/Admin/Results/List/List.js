import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import Table from '../../../../components/UI/Table/Table';
import IconLink from '../../../../components/UI/IconLink/IconLink';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

class AdminResultsList extends Component {

    cols = [
        { key: 'name', title: 'Name' },
        { key: 'abbreviation', title: 'Abbreviation' },
        { key: 'scenarios', title: 'Scenarios' },
        { key: 'resources', title: 'Resources' }
    ];

    refresh = () => {
        this.props.fetchBenefits();
    };

    editCommonResources = () => {
        this.props.history.push('/admin/resources/common');
    };

    editCommonLanguage = () => {
        this.props.history.push('/admin/language/results');
    };

    componentDidMount() {
        Logger.setComponent('Admin/Results/List');
        this.props.fetchBenefits();
    }

    render() {
        Logger.setComponent('Admin/Results/List');
        let body = null;

        if (this.props.loaded) {
            let rows = this.props.data
                .sort()
                .map(benefit => {
                    const slink = '/admin/results/' + benefit.code;
                    const rlink = '/admin/resources/' + benefit.code;
                    return {
                        code: benefit.code,
                        name: benefit.name,
                        abbreviation: benefit.abbreviation,
                        scenarios: <Link to={slink}><i className="fas fa-align-justify" title="Edit Scenarios"></i></Link>,
                        resources: <Link to={rlink}><i className="fas fa-link" title="Resources"></i></Link>,
                    };
                });

            body = (
                <Aux>
                    <h3>Results By Benefit</h3>
                    <Table
                        rows={rows}
                        cols={this.cols} />
                    <div className="Extras">
                        <h3>Non-Benefit Related Results</h3>
                        <p><IconLink icon="fas fa-align-justify"
                            title="Language"
                            append_text="Common Language"
                            to="/admin/language/results" /></p>
                        <p><IconLink icon="fas fa-link"
                            title="Resources"
                            append_text="Common Resources"
                            to="/admin/resources/common" /></p>
                    </div>
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

        return (
            <AdminPage
                title="Results: Manage the Results Page"
                breadcrumbs={['Admin', 'Results', 'List']}>
                {body}
            </AdminPage>
        );
    }

}

const mapStateToProps = state => {
    return {
        loaded: state.admin.shared.benefits.loaded,
        error: state.admin.shared.benefits.error,
        data: state.admin.shared.benefits.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchBenefits: () => dispatch(actions.loadBenefitsList())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminResultsList));
