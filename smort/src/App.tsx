import React from 'react';

import SiteRouter from './Router';
import { ServerIssues } from './Errors/ServerIssues';
import { TranslationProvider } from './translations/TranslationProvider';
import Style from './App.module.scss'
import { ThemeProvider } from './themes/themeProvider';


const App: React.FC = () => {
  
  return (
    <ThemeProvider>
      <TranslationProvider>
        <section className={Style.App}>
          {true == true ? <SiteRouter /> : <ServerIssues />}
        </section>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default App;
