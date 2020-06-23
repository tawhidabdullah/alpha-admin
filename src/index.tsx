import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';


// import redux store
import { store } from './state/store';


// import the main files of styles
import './styles/_main.scss';

ReactDOM.render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
);











