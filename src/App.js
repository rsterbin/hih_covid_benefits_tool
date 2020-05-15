import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import PreLaunch from './containers/PreLaunch/PreLaunch';

import './App.css';

// TODO: Session handling -- faster options, functionality post-launch to secure API requests
// TODO: Tests

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <PreLaunch />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
