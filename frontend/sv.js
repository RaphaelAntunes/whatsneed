// server.js
const cors_proxy = require('cors-anywhere');
const https = require('https');
const fs = require('fs');

const host = 'crm.whatsneed.com.br'; // Alterado para crm.whatsneed.com.br
const port = 9999;

// Configurações para o CORS Anywhere
const corsOptions = {
  originWhitelist: [], // Permitir todas as origens
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
};

// Configurações para o servidor HTTPS
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/crm.whatsneed.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/crm.whatsneed.com.br/fullchain.pem')
};

// Criação do servidor CORS Anywhere
const corsServer = cors_proxy.createServer(corsOptions);

// Criação do servidor HTTPS
const server = https.createServer(httpsOptions);

// Adiciona o CORS Anywhere como middleware no servidor HTTPS
server.addListener('request', (req, res) => {
  corsServer.emit('request', req, res);
});

// Inicia o servidor HTTPS
server.listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
