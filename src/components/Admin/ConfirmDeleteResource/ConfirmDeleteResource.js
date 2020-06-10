import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../UI/Modal/Modal';
import Markdown from '../../../utils/Markdown';

const confirmDeleteResource = (props) => {

    let contents = null;

    if (props.candidate) {
        contents = (
            <Aux>
                <h4>Are you sure you want to delete this resource?</h4>
                <div>
                    {props.candidate.benefit ?
                    <p><strong>Associated with</strong> {props.candidate.benefit.abbreviation}</p>
                    : null}
                    <p><strong>URL</strong> {props.candidate.link}</p>
                    <p><strong>Text</strong> {props.candidate.text}</p>
                    {props.candidate.desc ?
                    <div>
                        <p><strong>Description</strong></p>
                        <div dangerouslySetInnerHTML={{__html: Markdown.render(props.candidate.desc)}}></div>
                    </div>
                    : null}
                </div>
            </Aux>
        );
    }

    return (
        <Modal show={props.confirming} cancel={props.cancel}>
            {contents}
        </Modal>
    );

};

export default confirmDeleteResource;
