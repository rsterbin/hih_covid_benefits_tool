import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '../../UI/IconButton/IconButton';
import Markdown from '../../../utils/Markdown';

import './EditMarkdown.css';

const MARKDOWN_HELP_LINK = 'https://www.markdownguide.org/basic-syntax';

const EditMarkdown = (props) => {
    const [viewtype, setViewType] = useState('split');

    // Toggle buttons
    const doChange = (e, choice) => {
        e.preventDefault();
        setViewType(choice);
    };
    const doHelp = (e) => {
        e.preventDefault();
        window.open(MARKDOWN_HELP_LINK, '_blank');
    };
    const toggle = (
        <div className="ViewToggle">
            <IconButton icon="fas fa-columns"
                title="Split View"
                clicked={(e) => doChange(e, 'split')}
                append_text="split"
                add_class={viewtype === 'split' ? 'Active' : null} />
            <IconButton icon_type="edit"
                clicked={(e) => doChange(e, 'edit')}
                append_text="edit"
                add_class={viewtype === 'edit' ? 'Active' : null} />
            <IconButton icon_type="preview"
                clicked={(e) => doChange(e, 'preview')}
                append_text="preview"
                add_class={viewtype === 'preview' ? 'Active' : null} />
            <IconButton icon="far fa-life-ring"
                clicked={(e) => doHelp(e)}
                title="Markdown Help"
                append_text="help" />
        </div>
    );

    // Preview window
    const preview = Markdown.render(props.value);
    const previewBox = (
        <div className="PreviewBox">
            <div className="View" dangerouslySetInnerHTML={{__html: preview}} />
        </div>
    );

    // Edit window
    const minrows = props.minrows || 5;
    const editBox = (
        <div className="EditorBox">
            <TextareaAutosize rows="5" cols="75"
                minRows={minrows}
                name={props.name}
                defaultValue={props.value}
                onChange={props.changed} />
        </div>
    );

    if (viewtype === 'split') {
        return (
            <div className="EditMarkdown SplitEditor">
                {toggle}
                <div className="SplitWrapper">
                    <div className="SplitContainer">
                        <div className="SplitInternal">
                            <h5>Edit</h5>
                            {editBox}
                        </div>
                        <div className="SplitInternal">
                            <h5>Preview</h5>
                            {previewBox}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (viewtype === 'edit') {
        return (
            <div className="EditMarkdown SoloEditor">
                {toggle}
                {editBox}
            </div>
        );
    } else {
        return (
            <div className="EditMarkdown PreviewOnly">
                {toggle}
                {previewBox}
            </div>
        );
    }

};

export default EditMarkdown;
