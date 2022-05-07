import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

registerServiceWorker();
async function registerServiceWorker() {
  if (navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  } else {
    console.log('Service worker not supported by your browser');
  }
}
