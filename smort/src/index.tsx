import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Setting } from './prod/Settings';
import { smortApi } from './Api/smortApi';

let apiAvailable = false
smortApi.SetUpApiUrl();
Setting.Console();
smortApi.LoadCookies();
smortApi.SetupNotifications();


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  , document.getElementById('root'));

