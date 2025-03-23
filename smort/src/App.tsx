import React, { useState } from 'react';

import SiteRouter from './Router';
import { smortApi as smort } from './Api/smortApi';
import { ServerIssues } from './Errors/ServerIssues';
import { error } from 'console';



const App: React.FC = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean>(true)
  smort.PingApi().then(result => setApiAvailable(result)).catch(error => setApiAvailable(false));

  return (
    <>
      {true == true ? <SiteRouter /> : <ServerIssues />}
    </>
  );
};

export default App;
