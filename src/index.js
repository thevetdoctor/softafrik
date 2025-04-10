import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mailServiceUrl, reSubscribeAlways, token } from './utils/constants';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js').then(swReg => {
    console.log('Service Worker is registered', swReg);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
export const uIntArrayValue = urlBase64ToUint8Array('BDZIUMRhZEcT7daUm4SYPOn_5Lysqw-_XvCCBnYBEOlgOt5EcRHwyiOgFPDsJalVZv-l1_9pI0EcVLf6KbDQfAQ');

const subscribeUser = async () => {
    const sw = await navigator.serviceWorker.ready;
    const subscriptionExist = await sw.pushManager.getSubscription();

    console.log('subscriptionExist', subscriptionExist)
    if (!subscriptionExist || (reSubscribeAlways && subscriptionExist)) {
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: uIntArrayValue,
      });

      await fetch(`${mailServiceUrl}/notification/subscribe`, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
    };
  }
subscribeUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App /> // Remove <React.StrictMode>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
