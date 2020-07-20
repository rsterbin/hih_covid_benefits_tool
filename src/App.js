import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Before launch, we loaded the PreLaunch container to wrap everything in a global access login
import Main from './containers/Main/Main';

import './App.css';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Main />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
