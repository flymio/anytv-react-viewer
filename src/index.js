import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom'
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from './store/configureStore';
import './index.css';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import App from './container/App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
  , document.getElementById('root'));

