import React from 'react';

import Container from 'react-bootstrap/Container';

import ButtonsShowcase from './showcases/Buttons';
import ToastsShowcase from './showcases/Toasts';
import { LoginPage } from './Pages/LoginPage/LoginPage';
import SiteRouter from './Router';



const App: React.FC = () => {

  return(
      <SiteRouter/>
  );
};

export default App;
