import React, { Component } from 'react';

import PreLaunch from './containers/PreLaunch/PreLaunch';

import './App.css';

// TODO: Session handling -- faster options, functionality post-launch to secure API requests

class App extends Component {

    render() {
        return (
            <div className="App">
                <PreLaunch />
            </div>
        );
    }
}

export default App;
