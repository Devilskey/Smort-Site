import React from 'react';

import SiteRouter from './Router';
import { ServerIssues } from './Errors/ServerIssues';
import { TranslationProvider } from './translations/TranslationProvider';
import Style from './App.module.scss'


const App: React.FC = () => {
  return (
    <TranslationProvider>
      <section className={Style.App}>
        {true == true ? <SiteRouter /> : <ServerIssues />}
      </section>
    </TranslationProvider>
  );
};

export default App;
