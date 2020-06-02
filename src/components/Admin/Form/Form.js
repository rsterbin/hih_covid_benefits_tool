import React from 'react';

import Message from '../../UI/Message/Message';
import ProcessingButton from '../../UI/ProcessingButton/ProcessingButton';

import './Form.css';

const adminForm = (props) => {

    const doSubmit = (e) => {
        props.submitted(e);
        window.scrollTo(0, 0);
    };

    return (
        <div className="AdminForm">
            {props.success ?
                <Message type="success" text={props.success} />
            : null}
            {props.error ?
                <Message type="error" text={props.error} />
            : null}

            {props.help ?
                <div className="FormHeader">
                    <div className="HelpBox">{props.help}</div>
                </div>
            : null}

            <form method="post" onSubmit={props.submitted}>
                <div className="FormElements">
                    {props.children}
                </div>

                <div className="ButtonHolder">
                    <ProcessingButton
                        disabled={!props.valid}
                        working={props.processing}
                        clicked={doSubmit}
                        text={props.button_text || 'Submit'} />
                </div>
            </form>
        </div>
    );
};

export default adminForm;
