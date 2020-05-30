import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

import './AdminLayout.css';

class AdminLayout extends Component {
    render() {

        return (
            <div className="Admin">
                <div className="AdminNav">
                    <ul>
                        <li><NavLink exact to="/admin">Dashboard</NavLink></li>
                        <li><NavLink to="/admin/language">Language</NavLink></li>
                        <li><NavLink to="/admin/results">Results</NavLink></li>
                        <li><NavLink to="/admin/advanced">Advanced</NavLink></li>
                    </ul>
                </div>
                <div className="AdminMain">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default AdminLayout;
