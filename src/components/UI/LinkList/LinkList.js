import React from 'react';

const linkList = (props) => {
    let i = 0;
    const links = props.links.map(link => {
        let elem = null;
        if (link.sameSite) {
            elem = <a href={link.link}>{link.text}</a>
        } else {
            elem = <a href={link.link} target="_blank" rel="noopener noreferrer">{link.text}</a>
        }
        ++i;
        return (
            <li key={i}>
                {elem}
                {link.description ?
                    <p class="LinkDescription">{link.description}</p>
                : null}
            </li>
        );
    });
    return (
        <div className="LinkList">
            {props.header ?
                <h5>{props.header}</h5>
            : null}
            <ul>
                {links}
            </ul>
        </div>
    );
};

export default linkList;
