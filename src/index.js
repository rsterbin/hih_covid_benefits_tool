import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';

import btReducer from './storage/redux/reducers/benefitsTool';
import adReducer from './storage/redux/reducers/admin';
import plReducer from './storage/redux/reducers/prelaunch';

import './index.css';

const reducer = combineReducers({
    benefits_tool: btReducer,
    admin: adReducer,
    prelaunch: plReducer,
});


const logger = store => {
    return next => {
        return action => {
            console.log('[Middleware] Dispatching', action);
            const result = next(action);
            console.log('[Middleware] Next state', store.getState());
            return result;
        };
    };
};

const store = createStore(reducer, applyMiddleware(logger, thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
