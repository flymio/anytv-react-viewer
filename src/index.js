import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom'
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from './store/configureStore';
import 'bootstrap/dist/css/bootstrap.min.css';

//import './css/index.css';
import './css/app.css';
import './css/carousel.css';
import './css/form.css';
import './css/header.css';
import './css/section.css';


import App from './container/App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
  , document.getElementById('root'));

