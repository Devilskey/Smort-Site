import React, { useState } from 'react';

import SiteRouter from './Router';
import { smortApi as smort } from './Api/smortApi';
import { ServerIssues } from './Errors/ServerIssues';
import { error } from 'console';
import Style from './App.module.scss'


const App: React.FC = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean>(true)
  // smort.PingApi().then(result => setApiAvailable(result)).catch(error => setApiAvailable(false));

  return (
    <section className={Style.App}>
      {true == true ? <SiteRouter /> : <ServerIssues />}
      
    </section>
  );
};

export default App;
