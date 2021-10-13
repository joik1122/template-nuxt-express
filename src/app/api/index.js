const express = require('express')

// Create express instance
const app = express()


// Zipkin tracing
const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder: {JSON_V2} } = require("zipkin");
const HttpLogger = require('./modules/zipkin-custom/httpLogger');
const zipkinMiddleware = require("zipkin-instrumentation-express").expressMiddleware;
const tracer = new Tracer({
  ctxImpl: new ExplicitContext(),
  recorder: new BatchRecorder({
    logger: new HttpLogger({
      endpoint: "http://jaeger-collector.tracing:9411/api/v2/spans",
      jsonEncoder: JSON_V2,
    }),
  }),
  localServiceName: process.env.service_name
});
if(process.env.environment != "local") {
  app.use(zipkinMiddleware({ tracer }))
}
// End Zipkin

// Require API routes
const users = require('./routes/users')
const test = require('./routes/test')
const was = require('./routes/rp-was')
const auth_api = require('./routes/rp-auth-api')

// Import API Routes
app.use(users)
app.use(test)
app.use(was)
app.use(auth_api)

// Export express apps
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
