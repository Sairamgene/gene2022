const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/automail',
    createProxyMiddleware({
      target: 'https://bugsy-crm.wl.r.appspot.com',
      changeOrigin: true,
    })
  );//bugsynext\buid\index.html
//   app.get('*', './buid/index.html')
};