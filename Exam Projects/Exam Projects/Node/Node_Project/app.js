const express = require('express');
const httpContext = require('express-http-context');
var uuid = require('node-uuid');
const requestsLogger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const {logger} = require('./helpers/logging-helper');
const oauth = require('./helpers/oauth');

const app = express();

const users = require('./routes/users');
const exams = require('./routes/exams');


//reqId
app.use(httpContext.middleware);


//Middlewares
app.use(helmet());
app.use(requestsLogger(':date - :method :url - :referrer - :status - :response-time - :remote-addr - :user-agent'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.use(cors());
app.use(oauth);

//const baseHref = '';
let baseHref = process.env.API_BASE_HREF;
 if(!baseHref)
 {
 baseHref ="";
 }


app.get(baseHref + '/', (req, res, next) => {
  res.status(200).json({
    message: "Welcome to HCL customers API"
  });
});


app.use(baseHref  + '/users', users);
app.use(baseHref  + '/exams', exams);


//Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handler function
app.use((err, req, res, next) => {
  //respond to client
  const error = err;
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: error.message
    }
  });
  //respond to ourselves
  logger.error(error);
});

//Start the server
const port = process.env.PORT || 3007;
app.listen(port, () => {
  logger.info(`User Server is listening on port ${port}`);
});
