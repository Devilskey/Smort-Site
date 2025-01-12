import React from 'react';

import SiteRouter from './Router';
import { smortApi as smort } from './Api/smortApi';



const App: React.FC = () => {
  smort.SetUpApiUrl();

  return(
      <SiteRouter/>
  );
};

export default App;
