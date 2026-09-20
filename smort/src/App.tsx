import React from 'react';

import SiteRouter from './Router';
import { ServerIssues } from './Errors/ServerIssues';
import { TranslationProvider } from './translations/TranslationProvider';
import Style from './App.module.scss'
import { ThemeProvider } from './themes/themeProvider';
import { messaging, onMessage } from './configs/FirebaseConfig';


const App: React.FC = () => {
  
  onMessage(messaging, (payload) => {
  console.log("Foreground message received:", payload);
  // Display toast or update UI state
  });


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
