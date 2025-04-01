export const mailServiceUrl = process.env.MAIL_SERVICE_URL ?? 'https://mail.softafrik.com';
export const gatewayUrl = process.env.GATEWAY_URL ?? 'https://gateway.softafrik.com';
console.log('gateway url', process.env.REACT_APP_GATEWAY_URL ?? 'not found')
console.log('mail service url', process.env.REACT_APP_MAIL_SERVICE_URL ?? 'not found')