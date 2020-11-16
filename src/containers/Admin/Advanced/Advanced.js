import React, { Component } from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';

import List from './List/List';
import Save from './Save/Save';
import Load from './Load/Load';
import Replace from './Replace/Replace';
import Aux from '../../../hoc/Aux/Aux';

import './Advanced.css';

class AdminAdvanced extends Component {

    render() {
        const doSave = () => {
            return <Save token={this.props.token} />;
        };
        const doReplace = () => {
            return <Replace token={this.props.token} />;
        };
        return (
            <Aux>
                <Switch>
                    <Route path="/admin/advanced/load/:id" component={Load} />
                    <Route path="/admin/advanced/load" component={Load} />
                    <Route path="/admin/advanced/replace" render={doReplace} />
                    <Route path="/admin/advanced/save" render={doSave} />
                    <Route path="/" component={List} />
                </Switch>
                <div className="OtherFunctions">
                    <h4>Advanced Functions</h4>
                    <ul>
                        <li><Link to="/admin/advanced/save">Save Deploy</Link></li>
                        <li><Link to="/admin/advanced">List Deployments</Link></li>
                        <li><Link to="/admin/advanced/replace">Replace Database</Link></li>
                    </ul>
                </div>
            </Aux>
        );
    }

}

export default withRouter(AdminAdvanced);
