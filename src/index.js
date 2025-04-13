/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mailServiceUrl, reSubscribeAlways, token } from './utils/constants';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js').then((swReg) => {
    console.log('Service Worker is registered', swReg);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
export const uIntArrayValue = urlBase64ToUint8Array(
  'BDZIUMRhZEcT7daUm4SYPOn_5Lysqw-_XvCCBnYBEOlgOt5EcRHwyiOgFPDsJalVZv-l1_9pI0EcVLf6KbDQfAQ'
);

function getDeviceId() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID(); // or use a UUID library
    localStorage.setItem('deviceId', id);
  }
  return id;
}

export const subscribeUser = async () => {
  try {
    const sw = await navigator.serviceWorker.ready;
    const subscriptionExist = await sw.pushManager.getSubscription();

    const deviceId = getDeviceId();
    console.log('subscriptionExist', subscriptionExist);
    console.log('deviceId', deviceId);
    alert(`Permission ${Notification.permission}`);
    // --------------------------------------------------------------
    if (!subscriptionExist || reSubscribeAlways) {
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: uIntArrayValue,
      });
      // Extract the subscription JSON and attach your deviceId
      const subscriptionData = subscription.toJSON();

      const payload = {
        ...subscriptionData,
        deviceId,
      };

      console.log(Notification.permission === 'granted', 'subscribing');
      try {
        const response = await fetch(`${mailServiceUrl}/notification/subscribe`, {
          method: 'POST',
          body: JSON.stringify({ subscription: payload }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`${JSON.stringify(errorBody.error)}`);
        } else {
          alert(`Subscribed`);
        }
      } catch (e) {
        alert(`Failed to subscribe for notifications.\nReason: ${e.message}`);
        console.error('Subscription error:', e.message);
      }
    }
    // ---------------------------------------------------------------
  } catch (e) {
    console.log('Subscription error:', e.message);
    alert(`Permission ${Notification.permission}`);

    if (Notification.permission === 'denied') {
      alert('You’ve blocked notifications. You can enable them in your browser settings.');
    } else {
      alert('Something went wrong while enabling notifications.');
      alert(`${e.message}`);
    }
  }
};

export const checkPermission = async () => {
  const requestPermission = confirm('Would you like to enable notifications?');
  if (requestPermission) {
    // user clicked OK
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: uIntArrayValue,
    });
    // Extract the subscription JSON and attach your deviceId
    const subscriptionData = subscription.toJSON();

    const payload = {
      ...subscriptionData,
      deviceId, // your UUID from localStorage or similar
    };
    try {
      const response = await fetch(`${mailServiceUrl}/notification/subscribe`, {
        method: 'POST',
        body: JSON.stringify({ subscription: payload }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`${JSON.stringify(errorBody.error)}`);
      } else {
        alert(`Subscribed`);
        return true;
      }
    } catch (e) {
      alert(`Failed to subscribe for notifications.\nReason: ${e.message}`);
      console.error('Subscription error:', e.message);
    }
  } else {
    // user clicked Cancel
    alert('Notifications not enabled.');
  }
};
// subscribeUser();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
