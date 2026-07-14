import React, { useState } from 'react';

import SiteRouter from './Router';
import { ServerIssues } from './Errors/ServerIssues';
import Style from './App.module.scss'


const App: React.FC = () => {

  return (
    <section className={Style.App}>
      {true == true ? <SiteRouter /> : <ServerIssues />}
      
    </section>
  );
};

export default App;
