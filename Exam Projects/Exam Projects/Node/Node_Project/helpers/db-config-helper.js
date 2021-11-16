const sql = require('mssql')

module.exports = {
  config: {
    user: process.env.MSSQL_DB_LOGIN_USERNAME ? process.env.MSSQL_DB_LOGIN_USERNAME : "rkraju",
    password: process.env.MSSQL_DB_LOGIN_PASSWORD ? process.env.MSSQL_DB_LOGIN_PASSWORD : "12345",
    server: process.env.MSSQL_SERVER_HOST ? process.env.MSSQL_SERVER_HOST : "localhost",
    database: process.env.MSSQL_DB_NAME ? process.env.MSSQL_DB_NAME : "ExamsDB",
    pool: { max: process.env.MSSQL_CONNECTION_MAX_POOL ? +process.env.MSSQL_CONNECTION_MAX_POOL : 100 },
    connectionTimeout: process.env.MSSQL_CONNECTION_TIMEOUT ? +process.env.MSSQL_CONNECTION_TIMEOUT : 30000,
    requestTimeout: process.env.MSSQL_REQUEST_TIMEOUT ? +process.env.MSSQL_REQUEST_TIMEOUT : 30000,
  },
  sql: sql
}


