import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Setting } from './prod/Settings';
import { smortApi } from './Api/smortApi';
import { checkRedirect } from './configs/FirebaseConfig';


smortApi.SetUpApiUrl();
Setting.Console();
smortApi.SetupNotifications();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);