const {logger} = require('../helpers/logging-helper');
let jwt = require('jsonwebtoken');
const API_SECRET_KEY = process.env.API_SECRET_KEY ? process.env.API_SECRET_KEY : 'ihatecomplexcoding';;

module.exports = oauth;

async function oauth(req, res, next) {
  logger.trace(`oauth check`);
  try {
	
    // donot check token for getToken service 
	if(req.url.includes("register") || req.url.includes("login")) {
    next();
    
	} else{
    // check for Bearer auth header
		if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
		  logger.trace(`Malformed or missing auth header, sending 401 status to client with message`);
		  return res.status(401).send('Unauthorized Request');
		}

		// verify auth credentials
		let accessToken = req.headers.authorization.split(' ')[1];
		logger.debug(`oauth accessToken, ${accessToken}`)
    var decoded = '';

    logger.debug(`request url inclues refersh token  -> ${(req.url.toLowerCase()).includes('/refreshtoken')}`)
    
		if ((req.url.toLowerCase()).includes('/refreshtoken')) {
      
      logger.debug(`ignoring expiration time`);
      decoded = jwt.verify(accessToken, API_SECRET_KEY, {ignoreExpiration : true});
      
    } else{

      decoded = jwt.verify(accessToken, API_SECRET_KEY);
    }
    
		
		logger.debug(`jwt.decoded, ${JSON.stringify(decoded.response)}`)
		logger.debug('oauth accessToken', accessToken)
		req.user = decoded.response;

		next();
	}
  } catch (error) {
    
    let _errString = JSON.stringify(error);
    if (_errString.includes("TokenExpiredError")) {
      logger.trace(`${error}, sending 401 status to client`);
      return res.status(401).send(error);
    } else {

    logger.trace(`something went wrong ${error}, sending 500 status to client`);
    return res.status(500).send('Internal Server Error');
    }
  }

}