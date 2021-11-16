const router = require('express-promise-router')();
const usersController = require('../controllers/users');
const {validateBody, authorize, schemas, validateParam} = require('../helpers/routes-helper');
const roles = require('../helpers/roles');


router.route('/')
  .get([authorize([roles.admin,roles.user,roles.teacher])],usersController.getUsers);
router.route('/register').post([validateBody(schemas.validateSchemaRegister)], usersController.register);
router.route('/login').post([validateBody(schemas.validateSchemaLogin)], usersController.login);
router.route('/approve/:id').get([authorize([roles.admin,roles.user,roles.teacher]),validateParam(schemas.idSchema, 'id')],usersController.approveTeacher);
module.exports = router;