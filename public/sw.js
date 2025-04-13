const mailServiceUrl = 'https://mail.softafrik.com';

self.addEventListener('push', function (e) {
  let data = {};
  try {
    data = e.data.json();
  } catch (err) {
    console.error('Error parsing push data', err);
  }

  const { title, message, redirectUrl } = data?.payload?.message || {
    title: 'Buzz Updates',
    message: 'Trending news from Buzz',
    redirectUrl: mailServiceUrl
  };
  const options = {
    body: message,
    icon: 'https://res.cloudinary.com/thevetdoctor/image/upload/v1644026260/buzz/Buzz-logo-120.png',
    tag: `${Date.now()}`, // 👈 unique per notification
    renotify: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Date.now(), // 👈 unique too
      redirectUrl: redirectUrl,
    },
    actions: [{ action: 'view', title: 'View' }],
  };

  console.log('Parsed notification data:', { title, message, redirectUrl });
  e.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => console.log('[Service Worker] Notification shown'))
      .catch((err) => console.error('[Service Worker] showNotification error', err))
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  console.log(event.notification.data)
  const redirectUrl = event.notification.data?.redirectUrl || `${mailServiceUrl}`;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
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
