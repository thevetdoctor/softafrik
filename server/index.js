const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const helmet = require('helmet');
// app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://mail.softafrik.com'],
    },
  })
);
// the __dirname is the current directory from where the script is running
app.use(express.static(path.join(__dirname, '../build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});
// Inject ENV variables
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.env = {
    REACT_APP_BACKEND_URL: "${process.env.REACT_APP_BACKEND_URL}",
    REACT_APP_GATEWAY_URL: "${process.env.REACT_APP_GATEWAY_URL}",
    REACT_APP_MAIL_SERVICE_URL: "${process.env.REACT_APP_MAIL_SERVICE_URL}"
  };`);
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => console.log(`app is running on port ${port}`));
