import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import PreLaunch from './containers/PreLaunch/PreLaunch';

import './App.css';

// TODO: Admin tool for language
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
