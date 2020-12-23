import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginBox from '../../components/LoginBox/LoginBox';
import Language from '../../utils/Language';
import Logger from '../../utils/Logger';
import * as actions from '../../storage/redux/actions/index';

class Login extends Component {

    state = {
        username: '',
        password: '',
    };

    changeUsername = (e) => {
        this.setState({ username: e.target.value });
    };

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    };

    submit = (e) => {
        e.preventDefault();
        if (this.props.login_type === 'prelaunch') {
            this.props.onPrelaunchLogin(this.state.username, this.state.password);
        } else {
            this.props.onAdminLogin(this.state.username, this.state.password);
        }
    };

    componentDidMount() {
        if (this.props.login_type === 'prelaunch') {
            Logger.setComponent('Prelaunch/Login');
        } else {
            Logger.setComponent('Admin/Login');
        }
    }

    render() {
        if (this.props.login_type === 'prelaunch') {
            Logger.setComponent('Prelaunch/Login');
        } else {
            Logger.setComponent('Admin/Login');
        }
        const status = this.props.login_type === 'prelaunch' ? this.props.prelaunch_status : this.props.admin_status;
        if (status.logged_in) {
            return null;
        } else {

            const lang = {
                button_text: Language.get('prelaunch_login_button_text'),
                login_error: Language.get('prelaunch_login_error'),
                username_label: Language.get('prelaunch_login_username_label'),
                password_label: Language.get('prelaunch_login_password_label'),
            };

            return <LoginBox
                header={this.props.header}
                loading={status.processing}
                loginError={status.error}
                username={this.state.username}
                password={this.state.password}
                usernameChanged={this.changeUsername}
                passwordChanged={this.changePassword}
                submitted={this.submit}
                lang={lang} />;

        }
    }

}

const mapStateToProps = state => {
    return {
        prelaunch_status: {
            logged_in: state.prelaunch.username === null ? false : true,
            processing: state.prelaunch.processing,
            error: state.prelaunch.error,
        },
        admin_status: {
            logged_in: state.admin.auth.username === null ? false : true,
            processing: state.admin.auth.processing,
            error: state.admin.auth.error,
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onPrelaunchLogin: (username, password) => dispatch(actions.authenticatePrelaunch(username, password)),
        onAdminLogin: (username, password) => dispatch(actions.authenticateAdmin(username, password)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
