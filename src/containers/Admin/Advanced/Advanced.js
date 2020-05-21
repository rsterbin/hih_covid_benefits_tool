import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Init from './Init/Init';
import Save from './Save/Save';
import List from './List/List';
import Aux from '../../../hoc/Aux/Aux';

import './Advanced.css';

class AdminAdvanced extends Component {

    goToInit = () => {
        this.props.history.push('/admin/advanced/init');
    }

    goToSave = () => {
        this.props.history.push('/admin/advanced/save');
    }

    goToList = () => {
        this.props.history.push('/admin/advanced');
    }

    render() {
        const doSave = () => {
            return <Save token={this.props.token} />;
        };
        const doInit = () => {
            return <Init token={this.props.token} />;
        };
        const doList = () => {
            return <List token={this.props.token} />;
        };
        return (
            <Aux>
                <Switch>
                    <Route path="/admin/advanced/init" render={doInit} />
                    <Route path="/admin/advanced/save" render={doSave} />
                    <Route path="/" render={doList} />
                </Switch>
                <div className="OtherFunctions">
                    <h4>Advanced Functions</h4>
                    <ul>
                        <li><button onClick={this.goToInit}>Init Deploy</button></li>
                        <li><button onClick={this.goToSave}>Save Deploy</button></li>
                        <li><button onClick={this.goToList}>List Deployments</button></li>
                    </ul>
                </div>
            </Aux>
        );
    }

}

export default withRouter(AdminAdvanced);
