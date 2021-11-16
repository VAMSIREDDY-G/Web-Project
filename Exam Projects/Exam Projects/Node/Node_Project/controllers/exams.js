const { config, sql } = require('../helpers/db-config-helper');
const { logger } = require('../helpers/logging-helper');

const fs = require("fs");
let path = require("path");
const csv = require('csvtojson');

const { ExamListTvp, UserQuestionListTvp } = require('../helpers/funtion-helper');


module.exports = {

    uploadExamCsv: async (req, res, next) => {

        logger.debug(`Controller method exams -> uploadExamCsv`);


        try {

            logger.trace('successfully saved the uploaded svg ', req.file);
            const file = fs.readFileSync(path.resolve(__dirname, "../../client-assets/attachments/" + req.file.filename));
            let filepath = path.resolve(__dirname, "../../client-assets/attachments/" + req.file.filename);

            //Total csv data
            let jsonArray = await csv().fromFile(filepath);

            // to delete the file
            fs.unlinkSync(filepath);

            //to replcae space with '_' if there is a space between the column names
            jsonArray = JSON.parse(JSON.stringify(jsonArray).replace(/"([\w\s]+)":/g, function (m) {
                return m.replace(/\s+/g, '_');
            }));


            //to replcae "'" with "''" in order to insert the data id there is a "'"
            jsonArray = JSON.parse(JSON.stringify(jsonArray).replace(/'/g, "''"));

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request and execute query`);

            try {

                let request = pool.request();

                request.input('Title', req.body.title);
                request.input('ExamList', ExamListTvp(jsonArray));

                let result = await request.execute('spUploadExamQuestions');


                if (result.recordset && result.recordset.length > 0 && result.recordset[0]['ErrorMessage']) {
                    logger.trace(`warning caught, HTTP 409 -> ${result.recordset[0].ErrorMessage}`);
                    sql.close();

                    logger.debug(`sql connection closed, sending 409 response to client`);

                    res.status(409).send({
                        error: {
                            message: result.recordset[0].ErrorMessage,
                        },
                    });

                } else {

                    logger.debug(`executed query, result : csv uploaded successfully`);
                    sql.close();

                    logger.debug(`sql connection closed, sending 200 response to client`);

                    let response = { message: `File Upload successfully` }
                    res.status(200).json(response);
                }
            } catch (error) {
                const errorMsg = 'An error occurred while importing CSV file.'
                logger.trace('transaction errors are ' + JSON.stringify(error));
                logger.trace(`warning caught, HTTP 409 -> ${error.originalError.info.message}`);
                sql.close();

                logger.debug(`sql connection closed, sending 409 response to client`);

                res.status(409).send(errorMsg);
            }

        }
        catch (error) {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);

            res.status(500).send(error.name || '');
        }
    },

    addUserExam: async (req, res, next) => {
        logger.debug(`Controller method exaam -> addUserExam`);
        try {

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will connect request`);
            let request = pool.request();

            req.body.data.forEach((item) => {
                item.user_id = req.user.id
            })

            request.input('UserQuestionList', UserQuestionListTvp(req.body.data));

            let result = await request.execute('[dbo].[spAddUserExam]');
            let responseData = { message: `Exam Completed successfully` };

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(responseData)}`);
            res.status(200).json(responseData);

        } catch (error) {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
            res.status(500).send(error.name || '');
        }
    },

    getExams: async (req, res, next) => {


        logger.debug(`Controller method exams -> getExams`);

        try {

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request and execute query`);

            let request = pool.request();
            
            if(req.value && req.value.params){
               const { id } = req.value.params;
               request.input('UserId', id);
            } else {
                request.input('UserId', req.user.id);
            }

            let result = await request.execute('[dbo].[spGetExams]');
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

    getExamId: async (req, res, next) => {


        logger.debug(`Controller method exams -> getExamId`);

        try {

            const { id } = req.value.params;

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request and execute query`);

            let request = pool.request();

            request.input('UserId', req.user.id);
            request.input('ExamId', id);

            let result = await request.execute('[dbo].[spGetExamId]');
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
    }

}
