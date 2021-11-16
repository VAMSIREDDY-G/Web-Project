const { config, sql } = require('../helpers/db-config-helper');
const { logger } = require('../helpers/logging-helper');
let jwt = require('jsonwebtoken');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('@#$%^&*()');

const API_SECRET_KEY = "ihatecomplexcoding";
const TOKEN_EXPIRY_TIME = parseInt("9000000000");

module.exports = {


  register: async (req, res, next) => {
    logger.debug(`Controller method users -> register`);
    try {

      logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
      const pool = await new sql.ConnectionPool(config).connect();
      logger.trace(`connected to mssql, will connect request`);
      let request = pool.request();

      const password = cryptr.encrypt(req.value.body.password);

      request.input('Email', req.value.body.email);
      request.input('Password', password);
      request.input('Firstname', req.value.body.firstname);
      request.input('Lastname', req.value.body.lastname);
      request.input('UserType', req.value.body.user_type);

      let result = await request.execute('[dbo].[spUserRegister]');
      let resCode = 200;
      let responseData = { message: `User Registered sucssfully` };
      if (result.recordset && result.recordset.length > 0) {
        responseData = { message: result.recordset[0].message };
        resCode = 400
      }

      logger.trace(`will close sql connection`);
      sql.close();
      logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(responseData)}`);
      res.status(resCode).json(responseData);

    } catch (error) {
      logger.error(error);
      logger.debug(`sending 500 error response to client`);
      res.status(500).send(error.name || '');
    }
  },

  login: async (req, res, next) => {
    logger.debug(`Controller method users -> login`);
    try {

      logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
      const pool = await new sql.ConnectionPool(config).connect();
      logger.trace(`connected to mssql, will connect request`);
      let request = pool.request();

      const password = req.value.body.password;
      request.input('Email', req.value.body.email);

      let result = await request.execute('[dbo].[spUserLogin]');
      let responseData = { message: `User doesn't exists` };
      let resCode = 200;
      if (result.recordset.length > 0) {
        const passwordDecript = cryptr.decrypt(result.recordset[0].password);
        if (password == passwordDecript) {

          const details = result.recordset;

          const firstname = details[0].firstname;
          const user_type = details[0].user_type;
          const lastname = details[0].lastname;
          const email = details[0].emailid;
          const id = details[0].id;

          const response = { firstname, lastname, user_type, email, id };
          let token = jwt.sign({ response }, API_SECRET_KEY, { expiresIn: TOKEN_EXPIRY_TIME });

          responseData = { token: token, message: `User login successfully` };
        } else {
          responseData = { message: `Email and password doesn't match` };
        }
      } else {
         resCode = 400
      }


      logger.trace(`will close sql connection`);
      sql.close();
      logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(responseData)}`);
      res.status(resCode).json(responseData);

    } catch (error) {
      logger.error(error);
      logger.debug(`sending 500 error response to client`);
      res.status(500).send(error.name || '');
    }
  },

  getUsers: async (req, res, next) => {


    logger.debug(`Controller method analytics -> getUsers`);

    try {

      logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
      const pool = await new sql.ConnectionPool(config).connect();
      logger.trace(`connected to mssql, will create request and execute query`);

      let request = pool.request();

      let result = await request.execute('[dbo].[spGetUsers]');
      logger.debug(`executed query, result result ${JSON.stringify(result)}`);

      const responseData = { data: result.recordset, response: "success" };


      logger.debug(`executed query, result : Analytics table options updated successfully`);
      sql.close();

      logger.debug(`sql connection closed, sending 204 response to client`);

      res.status(200).json(responseData);
    } catch (error) {

      logger.error(error);
      logger.trace(`error caught, closing sql connection`);
      sql.close();
      logger.debug(`sql connection closed, sending 500 error response to client`);
      res.status(500).send(error.name || '');
    }
  },

  approveTeacher: async (req, res, next) => {


    logger.debug(`Controller method user -> approveTeacher`);

    try {

      logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
      const pool = await new sql.ConnectionPool(config).connect();
      logger.trace(`connected to mssql, will create request and execute query`);

      let request = pool.request();

      const { id } = req.value.params;

      let result = await request.query`update users set is_approved = 1 where id = ${id}`;
      logger.debug(`executed query, result result ${JSON.stringify(result)}`);

      const responseData = { response: "success" };


      logger.debug(`executed query, result : Analytics table options updated successfully`);
      sql.close();

      logger.debug(`sql connection closed, sending 204 response to client`);

      res.status(200).json(responseData);
    } catch (error) {

      logger.error(error);
      logger.trace(`error caught, closing sql connection`);
      sql.close();
      logger.debug(`sql connection closed, sending 500 error response to client`);
      res.status(500).send(error.name || '');
    }
  }

}