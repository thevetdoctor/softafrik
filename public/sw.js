const mailServiceUrl = 'https://mail.softafrik.com';

self.addEventListener('push', function (e) {

  if (Notification.permission === 'granted') {
    // Safe to subscribe
    console.warn('Notifications denied by user');

  } else if (Notification.permission === 'default') {
    // Ask user
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Now safe to subscribe
      } else {
        console.warn('Notifications denied by user');
      }
    });
  } else {
    // 'denied'
    console.warn('Notifications are blocked. Please enable them in your browser settings.');
  }
  
  let data = {};
  try {
    data = e.data.json();
  } catch (err) {
    console.error('Error parsing push data', err);
  }

  const { title, message } = data?.payload?.message || { title: 'Buzz Updates', message: 'Trending news from Buzz' };
  const options = {
    body: message,
    icon: 'https://res.cloudinary.com/thevetdoctor/image/upload/v1644026260/buzz/Buzz-logo-120.png',
    tag: `${Date.now()}`, // 👈 unique per notification
    renotify: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Date.now(), // 👈 unique too
      redirectUrl: `${mailServiceUrl}`
    },
    actions: [
      { action: 'view', title: 'View' },
    ],
  };

  console.log('Parsed notification data:', { title, message });
  e.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => console.log('[Service Worker] Notification shown'))
      .catch(err => console.error('[Service Worker] showNotification error', err))
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl || `${mailServiceUrl}`;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === redirectUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(redirectUrl);
      }
    })
  );
});
