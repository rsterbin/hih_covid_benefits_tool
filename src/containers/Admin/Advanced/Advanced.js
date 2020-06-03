import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import List from './List/List';
import Save from './Save/Save';
import Load from './Load/Load';
import Aux from '../../../hoc/Aux/Aux';

import './Advanced.css';

class AdminAdvanced extends Component {

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
        const doLoad = () => {
            return <Load token={this.props.token} />;
        };
        const doList = () => {
            return <List token={this.props.token} />;
        };
        return (
            <Aux>
                <Switch>
                    <Route path="/admin/advanced/load/:id" render={doLoad} />
                    <Route path="/admin/advanced/load" render={doLoad} />
                    <Route path="/admin/advanced/save" render={doSave} />
                    <Route path="/" render={doList} />
                </Switch>
                <div className="OtherFunctions">
                    <h4>Advanced Functions</h4>
                    <ul>
                        <li><button onClick={this.goToSave}>Save Deploy</button></li>
                        <li><button onClick={this.goToList}>List Deployments</button></li>
                    </ul>
                </div>
            </Aux>
        );
    }

}

export default withRouter(AdminAdvanced);
