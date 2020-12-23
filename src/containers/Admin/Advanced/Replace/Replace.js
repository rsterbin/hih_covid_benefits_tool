import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import FunctionBox from '../../../../components/Admin/FunctionBox/FunctionBox';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

class AdminAdvancedReplace extends Component {

    replaceDatabase = () => {
        this.props.replaceDatabase();
    }

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/Replace');
    }

    render() {
        Logger.setComponent('Admin/Advanced/Replace');
        return (
            <AdminPage
                title="Advanced Functions: Replace Database"
                breadcrumbs={['Admin', 'Advanced', 'Replace Database']}
                advanced={true}>
                <DeployMessage />
                <FunctionBox
                    working={this.props.processing}
                    emptyText="Click Go to replace the database..."
                    results={this.props.data}
                    title="Replace the admin database with the current files and create a new deployment"
                    explainer="This will destroy any changes that have been made in the admin that have not been saved to a deployment"
                    clicked={this.replaceDatabase}
                    buttonText="Go"
                    error={this.props.error}
                    />
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        processing: state.admin.deploys.replace.processing,
        error: state.admin.deploys.replace.error,
        data: state.admin.deploys.replace.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        replaceDatabase: () => dispatch(actions.replaceDatabaseWithCurrentDeployment()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminAdvancedReplace));
