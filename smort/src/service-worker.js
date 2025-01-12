import { precacheAndRoute } from 'workbox-precaching';


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registered: ', registration);
      }).catch(error => {
        console.error('Service Worker registration failed: ', error);
      });
    });
  }
  
/* eslint-disable no-restricted-globals */
  precacheAndRoute(self.__WB_MANIFEST);