import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../UI/Modal/Modal';
import Markdown from '../../../utils/Markdown';
import IconButton from '../../UI/IconButton/IconButton';
import ProcessingButton from '../../UI/ProcessingButton/ProcessingButton';

import './ConfirmDeleteResource.css';

const confirmDeleteResource = (props) => {

    let contents = null;

    if (props.candidate) {
        console.log(props.candidate);
        contents = (
            <Aux>
                <h4>Are you sure you want to delete this resource?</h4>
                <div>
                    <p><strong>Group:</strong> {props.candidate.benefit}</p>
                    <p><strong>URL:</strong> {props.candidate.link}</p>
                    <p><strong>Text:</strong> {props.candidate.text}</p>
                    {props.candidate.desc ?
                    <div>
                        <p><strong>Description:</strong></p>
                        <div dangerouslySetInnerHTML={{__html: Markdown.render(props.candidate.desc)}}></div>
                    </div>
                    : null}
                </div>
                <div className="DeleteButton">
                    <ProcessingButton
                        working={props.working}
                        clicked={props.confirm}
                        text="Delete" />
                </div>
            </Aux>
        );
    }

    return (
        <Modal show={props.confirming} cancel={props.cancel}>
            <div className="ConfirmDeleteResource">
                <div className="CloseButton">
                    <IconButton icon_type="close" clicked={props.cancel} />
                </div>
                {contents}
            </div>
        </Modal>
    );

};

export default confirmDeleteResource;
