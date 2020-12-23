import React, { Component } from 'react';
import { connect } from 'react-redux';

import Main from '../Main/Main';
import Login from '../Login/Login';
import LoginLayout from '../../hoc/LoginLayout/LoginLayout';
import * as actions from '../../storage/redux/actions/index';

class PreLaunch extends Component {

    componentDidMount() {
        this.props.checkAuthState();
    }

    render() {
        if (this.props.authenticated) {
            return <Main />;
        } else {
            return (
                <LoginLayout>
                    <Login login_type="prelaunch" />
                </LoginLayout>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.prelaunch.username === null ? false : true
    };
};

const mapDispatchToProps = dispatch => {
    return {
        checkAuthState: () => dispatch(actions.checkPrelaunchAuthState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreLaunch);
