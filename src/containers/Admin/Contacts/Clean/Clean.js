import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Logger from '../../../../utils/Logger';

class AdminContactsClean extends Component {

    componentDidMount() {
        Logger.setComponent('Admin/Contacts/Clean');
    }

    render() {
        Logger.setComponent('Admin/Contacts/Clean');
        return (
            <AdminPage
                title="Contacts: Clean"
                breadcrumbs={['Admin', 'Contacts', 'Clean']}>
                <h3>Clean Contacts</h3>
                <p>TODO</p>
            </AdminPage>
        );
    }

}

export default withRouter(AdminContactsClean);
