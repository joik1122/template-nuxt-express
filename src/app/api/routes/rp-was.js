
const { Router } = require('express')
const proxy = require('express-http-proxy')
const router = Router()

/* Zipkin Proxy */
const {BatchRecorder, jsonEncoder: {JSON_V2}, Tracer, ExplicitContext} = require('zipkin');
const wrapExpressHttpProxy = require('../modules/zipkin-custom/wrapExpressHttpProxy');
const HttpLogger = require('../modules/zipkin-custom/httpLogger');

const ctxImpl = new ExplicitContext();
const tracer = new Tracer({
  ctxImpl, 
  localServiceName: process.env.service_name, 
  recorder: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: 'http://jaeger-collector.tracing:9411/api/v2/spans',
      jsonEncoder: JSON_V2
    })
  })
});
const remoteServiceName = 'rp-auth-api';
const zipkinProxy = process.env.environment != "local" ? wrapExpressHttpProxy(proxy, {tracer, remoteServiceName}) : proxy;
/* End Zipkin proxy */

const API_HOST = process.env.environment == 'local' ? 'https://prod.realpacking.com' : 'http://rp-was.prod';
const API_PATH = process.env.environment == 'local' ? '/rp-was' : '';

router.use('/was', zipkinProxy(API_HOST, {
  timeout: 60000,

  proxyReqPathResolver: function (req) {
    let parts = req.url.split('?')
    let queryString = parts[1]
    let updatedPath = parts[0] // '/rp-was/healthz' //parts[0].replace(/test/, 'tent');
    return API_PATH + updatedPath + (queryString ? '?' + queryString : '')
  },

  // userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
  //   //JSON.parse(proxyResData.toString('utf8'));
  //   // for (output in proxyRes){
  //   //   console.log(JSON.stringify(output))
  //   // }
  //   // console.log(proxyRes.statusCode)
  //   // console.log(proxyRes.statusMessage)
  //   // console.log(proxyRes.url)
  //   // console.log(proxyRes.method)
  //   // console.log(proxyRes.headers)
  //   let data = {
  //     body : proxyResData.toString('utf8'),
  //     date : new Date()
  //   }
  //   data.newProperty = 'exciting data';
  //   return JSON.stringify(data);
  // }, 

  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    return proxyResData;
  }, 

  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // recieves an Object of headers, returns an Object of headers.
    return proxyRes.headers;
  }
}))

module.exports = router

