const router = require('express-promise-router')();
const uuidv1 = require('uuid/v1');
const uuidv5 = require('uuid/v5');

const multer = require('multer');

const examController = require('../controllers/exams');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

const attachmentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        let file_type = '';
        if(file.mimetype === 'image/png' ||  file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg'){
            file_type = 'image';
        } else if (file.mimetype === 'application/vnd.ms-powerpoint' || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
           file_type = 'ppt';
        } else if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
           file_type = 'doc';
        } else if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'text/csv') {
            file_type = 'excel';
        } else if (file.mimetype === 'application/pdf' ) {
            file_type = 'pdf';
        } else if (file.mimetype === 'text/plain' ) {
            file_type = 'txt';
        }

        let destFolder = '../client-assets/attachments';
        cb(null, destFolder);
    },
    filename: function (req, file, cb) {
        const extn = getFileExtension(file);
        const namespace = uuidv1();
        const newFilename = uuidv5(file.originalname, namespace) + extn;
        cb(null, newFilename);
    }

});


const attachmentFileFilter = (req, file, cb) => {
    switch(file.mimetype)
    {
        case  'image/png':
        case  'image/jpeg':
        case  'image/jpg':
        case  'application/vnd.ms-powerpoint':
        case  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case  'application/msword':
        case  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case  'application/vnd.ms-excel':
        case  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 
        case  'application/pdf':
        case  'text/csv': 
        case  'text/plain':  
            cb(null, true);
        break;


        default : 
            const err = new Error('The file is not a valid upload type');
            err.status = 409;
            err.message = "The file is not a valid upload type";
            cb(err, false);
        break;
        
    }
    
};


const attachmentsUpload = multer({
    storage: attachmentsStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: attachmentFileFilter
});


function getFileExtension(file)
{
    let extn = '';
    const type = file.originalname.split('.');
    if (type.pop() == 'csv') {
        file.mimetype = 'text/csv';
    }

    switch(file.mimetype)
    {
        case 'image/jpg':
            extn  = '.jpg';
            break;
        
        case 'image/jpeg':
            extn  = '.jpeg';
            break;
            
         case 'image/png':
            extn  = '.png';
            break;  

        case 'application/vnd.ms-powerpoint':
            extn  = '.ppt';
            break;

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            extn  = '.pptx';
            break;

        case 'application/msword':
            extn = '.doc';
            break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            extn = '.docx';
            break;

        case 'application/vnd.ms-excel':
            extn = '.xls';
            break;

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 
            extn = '.xlsx';
            break;

        case 'application/pdf':
            extn = '.pdf';
            break;
        
        case  'text/csv':
            extn = '.csv';
            break;
        
        case  'text/plain':
            extn = '.txt';
            break;


    }

    return extn;
}

router.route('/').get([authorize([roles.admin,roles.user,roles.teacher])],examController.getExams);

router.route('/:id').get([authorize([roles.admin,roles.user,roles.teacher]),validateParam(schemas.idSchema, 'id')],examController.getExamId);

router.route('/upload')
    .post([authorize([roles.admin, roles.user,roles.teacher]), attachmentsUpload.single('attachment')], examController.uploadExamCsv);
   
router.route('/user').post([authorize([roles.admin, roles.user,roles.teacher]),validateBody(schemas.validateSchemaForUserExam)], examController.addUserExam);

router.route('/user/:id').get([authorize([roles.admin,roles.user,roles.teacher]),validateParam(schemas.idSchema, 'id')],examController.getExams);

module.exports = router;