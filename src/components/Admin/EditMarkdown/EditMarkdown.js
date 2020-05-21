import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '../../UI/IconButton/IconButton';

import './EditMarkdown.css';

const editMarkdown = (props) => {
    if (props.previewing) {
        const md = require('markdown-it')();
        const preview = md.render(props.value);
        return (
            <div className="PreviewMarkdown">
                <h5>Preview</h5>
                <div className="View" dangerouslySetInnerHTML={{__html: preview}} />
                <div className="EditToggle">
                    <IconButton icon_type="edit"
                        clicked={props.clickedEdit}
                        append_text="edit" />
                </div>
            </div>
        );
    } else {
        const minrows = props.minrows || 5;
        return (
            <div className="EditMarkdown">
                <TextareaAutosize rows="5" cols="75"
                    minRows={minrows}
                    name={props.name}
                    defaultValue={props.value}
                    onChange={props.changed} />
                <div className="PreviewToggle">
                    <IconButton icon_type="preview"
                        clicked={props.clickedPreview}
                        append_text="preview" />
                </div>
            </div>
        );
    }
};

export default editMarkdown;
