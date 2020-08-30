import React from 'react';

import './Layout.css';

const layout = (props) => {

    const copyrightDate = (new Date()).getFullYear();
    return (
        <div className="BenefitsTool">
            <div className="Logo">
                <a href="https://domesticemployers.org/"><img src="/images/logo.png" alt={props.lang.logo_alt_text} /></a>
            </div>
            <div className="Header">
                <h1><a href="/">{props.lang.header_title}</a></h1>
            </div>
            <div className="MainContent">
                {props.children}
            </div>
            <div className="Footer">
                <ul className="SocialIcons">
                    <li><a href="https://www.facebook.com/domesticemployers/"><i className="fab fa-facebook-f" title={props.lang.facebook_title}></i></a></li>
                    <li><a href="https://twitter.com/HiHemployers"><i className="fab fa-twitter" title={props.lang.twitter_title}></i></a></li>
                </ul>
                <ul className="Links">
                    <li><a href="https://domesticemployers.org/">&copy; {copyrightDate} Hand In Hand</a></li>
                </ul>
            </div>
        </div>
    );
};

export default layout;
