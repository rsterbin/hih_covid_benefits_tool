import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

// After launch, load Main directly instead
import PreLaunch from './containers/PreLaunch/PreLaunch';

import './App.css';

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
