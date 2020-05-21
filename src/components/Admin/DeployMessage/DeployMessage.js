import React from 'react';
import { DateTime } from 'luxon';

import Message from '../../UI/Message/Message';
import DeployData from '../../../data/deployment.json';

const deployMessage = (props) => {
    const dt = DateTime.fromISO(DeployData.date_deployed);
    const deployTime = dt.toLocaleString(DateTime.DATETIME_FULL);
    return (
        <Message type="info"
            text={'The current deployment is v' + DeployData.version_num + ', deployed ' + deployTime} />
    );
};

export default deployMessage;
