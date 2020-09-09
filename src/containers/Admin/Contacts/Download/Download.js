import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminPage from '../../../../hoc/AdminPage/AdminPage';
import Api from '../../../../storage/Api';
import Logger from '../../../../utils/Logger';

class AdminContactsDownload extends Component {

    componentDidMount() {
        Logger.setComponent('Admin/Contacts/Download');
    }

    render() {
        Logger.setComponent('Admin/Contacts/Download');
        const url = Api.getContactsDownloadUrl(this.props.token);
        return (
            <AdminPage
                title="Contacts: Download Cleaned"
                breadcrumbs={['Admin', 'Contacts', 'Download Cleaned']}>
                <h3>Download Contacts</h3>
                <a download="contacts.csv" href={url}>
                    <i className="fas fa-download" title="download"></i>
                </a>
            </AdminPage>
        );
    }

}

export default withRouter(AdminContactsDownload);
