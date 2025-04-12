export const gatewayUrl = process.env.REACT_APP_GATEWAY_URL || 'https://gateway.softafrik.com';
export const mailServiceUrl =
  process.env.REACT_APP_MAIL_SERVICE_URL || 'https://mail.softafrik.com';
export const reSubscribeAlways = process.env.REACT_APP_RESUBSCRIBE_ALWAYS || false;
export const token = process.env.REACT_APP_TOKEN ?? 'FqjKT1ULwU4TaFSm5BPb';
console.log('process.env.REACT_APP_GATEWAY_URL', process.env.REACT_APP_GATEWAY_URL);
console.log('process.env.REACT_APP_MAIL_SERVICE_URL', process.env.REACT_APP_MAIL_SERVICE_URL);
console.log('process.env.REACT_APP_RESUBSCRIBE_ALWAYS', process.env.REACT_APP_RESUBSCRIBE_ALWAYS);
