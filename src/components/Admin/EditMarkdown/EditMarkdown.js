import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '../../UI/IconButton/IconButton';
import Markdown from '../../../utils/Markdown';
import { TOKEN_REGEX_TAG_OPEN, TOKEN_REGEX_TAG_CLOSE } from '../../../utils/Language';

import './EditMarkdown.css';

const MARKDOWN_HELP_LINK = 'https://www.markdownguide.org/basic-syntax';
const HIGHLIGHT_OPEN = 'BEGIN_HIGHLIGHT';
const HIGHLIGHT_CLOSE = 'END_HIGHLIGHT';
const HIGHLIGHT_TOKEN_OPEN = '{{' + HIGHLIGHT_OPEN + '}}';
const HIGHLIGHT_TOKEN_CLOSE = '{{' + HIGHLIGHT_CLOSE + '}}';

const EditMarkdown = (props) => {
    const [viewtype, setViewType] = useState('split');
    const [replacement, setReplacement] = useState('');
    const [previewText, setPreviewText] = useState(props.value || '');
    const [wrapped, setWrapped] = useState(false);
    const [highlighted, setHighlighted] = useState(false);

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

    // Replacement buttons
    let replacementButtons = null;
    let doValueChange = (e) => {
        props.changed(e);
        let newtext = e.target.value;
        setPreviewText(newtext);
    };
    if (props.replace_token && (viewtype === 'split' || viewtype === 'preview')) {
        const regexp = new RegExp(TOKEN_REGEX_TAG_OPEN +
            props.replace_token + TOKEN_REGEX_TAG_CLOSE, 'g');

        const doReplacement = (e) => {
            if (e) {
                e.preventDefault();
            }
            var choice = e.target.options[e.target.selectedIndex].value;
            setReplacement(choice);
            let newtext = props.value || '';
            if (choice) {
                const elem = HIGHLIGHT_TOKEN_OPEN + choice + HIGHLIGHT_TOKEN_CLOSE;
                newtext = newtext.replace(regexp, elem);
                setWrapped(true);
            }
            setPreviewText(newtext);
        };

        doValueChange = (e) => {
            props.changed(e);
            if (props.replace_token && (viewtype === 'split' || viewtype === 'preview')) {
                let newtext = e.target.value;
                if (replacement) {
                    const elem = HIGHLIGHT_TOKEN_OPEN + replacement + HIGHLIGHT_TOKEN_CLOSE;
                    newtext = newtext.replace(regexp, elem);
                    setWrapped(true);
                }
                setPreviewText(newtext);
            }
        }

        let doHighlight = (e) => {
            setHighlighted(!highlighted);
        };

        let token = '{{' + props.replace_token + '}}';
        let options = props.replace_options.map(option => {
            return <option key={option} value={option}>{option}</option>;
        });

        replacementButtons = (
            <div className="ViewReplacement">
                <div className="ExplainReplacement">
                    Replace
                    <span className="ReplacementToken">{token}</span>
                    with:
                </div>
                <div className="ReplacementOptions">
                    <select name="replacement" onChange={doReplacement} value={replacement}>
                        <option value="">-- do not replace --</option>
                        {options}
                    </select>
                </div>
                <div className="ReplacementHighlight">
                    <label>
                        <input type="checkbox" onChange={doHighlight} />
                        Highlight
                    </label>
                </div>
            </div>
        );
    }

    // Preview window
    let preview = Markdown.render(previewText);
    if (props.replace_token && (viewtype === 'split' || viewtype === 'preview')) {
        let hlclasses = [ 'PreviewToken' ];
        if (highlighted) {
            hlclasses.push('Active');
        }
        if (wrapped) {
            const regexp1 = new RegExp(TOKEN_REGEX_TAG_OPEN + HIGHLIGHT_OPEN + TOKEN_REGEX_TAG_CLOSE, 'g');
            const regexp2 = new RegExp(TOKEN_REGEX_TAG_OPEN + HIGHLIGHT_CLOSE + TOKEN_REGEX_TAG_CLOSE, 'g');
            preview = preview.replace(regexp1, '<span class="' + hlclasses.join(' ') + '">');
            preview = preview.replace(regexp2, '</span>');
        } else {
            const regexp = new RegExp(TOKEN_REGEX_TAG_OPEN +
                props.replace_token + TOKEN_REGEX_TAG_CLOSE, 'g');
            preview = preview.replace(regexp, '<span class="' + hlclasses.join(' ') + '">{{' + props.replace_token + '}}</span>');
        }
    }
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
                onChange={doValueChange} />
        </div>
    );

    if (viewtype === 'split') {
        return (
            <div className="EditMarkdown SplitEditor">
                {toggle}
                {replacementButtons}
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
                {replacementButtons}
                {previewBox}
            </div>
        );
    }

};

export default EditMarkdown;
