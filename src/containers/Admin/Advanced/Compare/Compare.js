import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import Message from '../../../../components/UI/Message/Message';
import DeployMessage from '../../../../components/Admin/DeployMessage/DeployMessage';
import CompareForm from '../../../../components/Admin/CompareForm/CompareForm';
import DiffDeploys from '../../../../components/Admin/DiffDeploys/DiffDeploys';
import Logger from '../../../../utils/Logger';
import * as actions from '../../../../storage/redux/actions/index';

class AdminAdvancedCompare extends Component {

    state = {
        selectedA: null,
        selectedB: null
    };

    refreshInit = () => {
        this.init();
    };

    refreshCompare = () => {
        this.compare();
    };

    onChangeA = (e) => {
        this.setState({ selectedA : e.target.value });
    };

    onChangeB = (e) => {
        this.setState({ selectedB : e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.selectedA && this.state.selectedB) {
            const a = this.state.selectedA;
            const b = this.state.selectedB;
            this.props.history.push('/admin/advanced/compare/' + a + '/' + b);
            this.props.compare(a, b);
        }
    };

    onReset = (e) => {
        e.preventDefault();
        if (this.state.selectedA && this.state.selectedB) {
            this.setState({ selectedA: null, selectedB: null }, () => {
                this.props.history.push('/admin/advanced/compare');
                this.props.reset();
            });
        }
    };

    componentDidMount() {
        Logger.setComponent('Admin/Advanced/Load');
        this.init();
    }

    init() {
        this.props.fetchList();
        const a = this.getVersionA();
        const b = this.getVersionB();
        if (a && b) {
            this.setState({ selectedA: a, selectedB: b });
            this.props.compare(a, b);
        }
    }

    compare() {
        this.props.compare(this.state.selectedA, this.state.selectedB);
    }

    getVersionA() {
        if (this.props.match.params.avnum) {
            return this.props.match.params.avnum;
        }
        return null;
    }

    getVersionB() {
        if (this.props.match.params.bvnum) {
            return this.props.match.params.bvnum;
        }
        return null;
    }

    render() {
        Logger.setComponent('Admin/Advanced/Compare');
        let body = null;
        if (!this.props.loaded) {
            let errmsg = [];
            if (this.props.list_error) {
                errmsg.push(this.props.list_error);
            }
            if (this.props.error) {
                errmsg.push(this.props.error);
            }
            body = (
                <Aux>
                    {errmsg.length > 0 ?
                        <Message type="error" text={errmsg.join("\n")} tryagain={this.refreshInit} />
                    : null}
                    <Spinner />
                </Aux>
            );

        } else {

            let options = this.props.list_data.map(deploy => { return {
                value: deploy.version_num,
                text: 'Version ' + deploy.version_num
            }})
            options.unshift({ value: 'admin', text: 'Current state of admin' });
            let presets = null;
            let controls = true;
            let titles = { a: 'None', b: 'None'};

            if (this.getVersionA() && this.getVersionB()) {
                presets = {a: this.getVersionA(), b: this.getVersionB()};
                controls = true;
            } else if (this.props.avnum && this.props.bvnum) {
                presets = { a: this.props.avnum, b: this.props.bvnum };
            }

            if (presets !== null) {
                for (const opt of options) {
                    if (opt.value === presets.a) {
                        titles.a = opt.text;
                    }
                    if (opt.value === presets.b) {
                        titles.b = opt.text;
                    }
                }
            }

            const form = (
                <CompareForm
                    current={{ a: this.state.selectedA, b: this.state.selectedB }}
                    presets={presets}
                    options={options}
                    controls={controls}
                    changedA={this.onChangeA}
                    changedB={this.onChangeB}
                    submit={this.onSubmit}
                    reset={this.onReset} />
            );

            let result = null;
            if (this.props.data) {
                result = (
                    <DiffDeploys
                        comparison={this.props.data.comparison}
                        dataA={this.props.data.a}
                        dataB={this.props.data.b}
                        titles={titles}
                        />
                );
            } else if (this.props.processing) {
                result = <Spinner />;
            } else if (this.props.error) {
                result = <Message type="error" text={this.props.error} tryagain={this.refreshCompare} />
            }

            body = (
                <Aux>
                    {form}
                    {result}
                </Aux>
            );
        }

        return (
            <AdminPage
                title="Advanced Functions: Compare Deployments"
                breadcrumbs={['Admin', 'Advanced', 'Compare Deployments']}
                advanced={true}>
                <DeployMessage />
                {body}
            </AdminPage>
        );
    }
}

const mapStateToProps = state => {
    return {
        loaded: state.admin.deploys.list.loaded,
        list_error: state.admin.deploys.list.error,
        list_data: state.admin.deploys.list.data,
        avnum: state.admin.deploys.compare.avnum,
        bvnum: state.admin.deploys.compare.bvnum,
        processing: state.admin.deploys.compare.processing,
        error: state.admin.deploys.compare.error,
        data: state.admin.deploys.compare.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchList: () => dispatch(actions.loadDeployments()),
        compare: (avnum, bvnum) => dispatch(actions.compareDeployments(avnum, bvnum)),
        reset: () => dispatch(actions.resetCompareDeployments()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminAdvancedCompare));
