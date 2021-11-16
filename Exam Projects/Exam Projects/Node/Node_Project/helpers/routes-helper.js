const Joi = require('joi');
const { optional } = require('joi/lib/types/lazy');
const { logger } = require('../helpers/logging-helper');

module.exports = {

  validateParam: (schema, name) => {

    return (req, res, next) => {

      const result = Joi.validate({
        param: req['params'][name]
      }, schema);

      if (result.error) {
        logger.error(result.error);
        return res.status(400).json(result.error);
      }
      else {
        logger.debug(`request paramaters validated`);

        if (!req.value)
          req.value = {};

        if (!req.value['params'])
          req.value['params'] = {};

        req.value['params'][name] = result.value.param;
        next();
      }
    };
  },

  validateBody: (schema) => {

    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        logger.error(result.error);
        return res.status(400).json(result.error);
      } else {
        logger.debug(`request body validated`);

        if (!req.value)
          req.value = {};

        if (!req.value['body'])
          req.value['body'] = {};

        req.value['body'] = result.value;
        next();
      }
    };
  },

  authorize: (roles = []) => {

    if (typeof roles === 'string') {

      logger.debug(`authorize roles string`);

      roles = [roles];

    }

    return [

      // authorize based on user role
      (req, res, next) => {

        if (req.user.user_type) {

          if (typeof req.user.user_type === 'string') {

            logger.debug(`authorize roles string`);

            req.user.user_type = [req.user.user_type];
          }
        }

        logger.debug(`authorize req role user ${req.user.user_type}`);
        logger.debug(`authorize req role user length ${req.user.user_type.length}`);
        logger.debug(`authorize roles ${roles}`);
        logger.debug(`authorize roles length ${roles.length}`);

        if (roles.length && req.user.user_type) {

          let isValidate = false;

          for (var apiRole of roles) {

            for (var userRole of req.user.user_type) {

              if (apiRole == userRole) {
                isValidate = true;
              }
            }
          }

          logger.debug(`authorize isValidate ${isValidate}`);

          if (isValidate) {

            logger.debug(`role for user ${req.user.user_type} sending allowing access`);
          } else {

            // user's role is not authorized
            logger.debug(`role for user ${req.user.user_type || 'no role'} sending 403 status`);
            return res.status(403).json({
              message: 'Forbidden for the user'
            });
          }
        }

        // authentication and authorization successful
        next();
      }
    ];

  },

  schemas: {

    //Generic params
    idSchema: Joi.object().keys({
      param: Joi.number().required()
    }),

    validateSchemaRegister: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      user_type: Joi.string().required(),
    }),

    validateSchemaUpload: Joi.object().keys({
      title: Joi.string().required()
    }),

    validateSchemaLogin: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),

    validateSchemaForUserExam: Joi.object().keys({
      data: Joi.array().items(Joi.object().keys({
        question_id : Joi.number().required(),
        exam_id : Joi.number().required(),
        answer : Joi.string().allow(null,'').required(),
      })).required(),
    }),
  }
}