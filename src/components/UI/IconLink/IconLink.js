import React from 'react';
import { Link } from 'react-router-dom';

import Aux from '../../../hoc/Aux/Aux';

import './IconLink.css';

const iconLink = (props) => {
    let classes = [ 'IconLink' ];
    let title = null;
    let icon = 'fas fa-question';
    if (props.icon_type === 'refresh') {
        title = 'refresh';
        icon = 'fas fa-sync-alt';
    } else if (props.icon_type === 'edit') {
        title = 'edit';
        icon = 'fas fa-pencil-alt';
    } else if (props.icon_type === 'preview') {
        title = 'preview';
        icon = 'far fa-eye';
    } else if (props.icon_type === 'new') {
        title = 'new';
        icon = 'fas fa-plus-circle';
    } else if (props.icon_type === 'close') {
        title = 'close';
        icon = 'fas fa-times';
    }
    if (props.title) {
        title = props.title;
    }
    if (props.icon) {
        icon = props.icon;
    }
    if (props.add_class) {
        classes.push(props.add_class);
    }
    const contents = (
        <Aux>
            <i className={icon} title={title}></i>
            {props.append_text ?
                <span>{props.append_text}</span>
            : null}
        </Aux>
    );
    if (props.to.match('^http')) {
        return (
            <a className={classes.join(' ')} download={props.download} href={props.to}>
                {contents}
            </a>
        );
    } else {
        return (
            <Link className={classes.join(' ')} to={props.to}>
                {contents}
            </Link>
        );
    }
};

export default iconLink;
