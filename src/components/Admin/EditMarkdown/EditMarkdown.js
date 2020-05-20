import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import './EditMarkdown.css';

const editMarkdown = (props) => {
    if (props.previewing) {
        const md = require('markdown-it')();
        const preview = md.render(props.value);
        return (
            <div className="PreviewMarkdown">
                <h5>Preview</h5>
                <div className="View" dangerouslySetInnerHTML={{__html: preview}} />
                <button className="EditToggle" onClick={props.clickedEdit}><i className="fas fa-pencil-alt"></i> edit</button>
            </div>
        );
    } else {
        return (
            <div className="EditMarkdown">
                <TextareaAutosize rows="5" cols="75"
                    minrows="5"
                    name={props.name}
                    defaultValue={props.value}
                    onChange={props.changed} />
                <button className="PreviewToggle" onClick={props.clickedPreview}><i className="far fa-eye"></i> preview</button>
            </div>
        );
    }
};

export default editMarkdown;
