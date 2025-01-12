import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Setting } from './prod/Settings';
import { smortApi } from './Api/smortApi';

Setting.Console();
smortApi.LoadCookies();

ReactDOM.render(
      <React.StrictMode>
          <App />
      </React.StrictMode>
      , document.getElementById('root'));
