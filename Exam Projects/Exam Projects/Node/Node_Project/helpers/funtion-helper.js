const { sql} = require('../helpers/db-config-helper');

const ExamListTvp = (array) => {
    const examList = new sql.Table('ExamList');
    examList.columns.add('question', sql.NVarChar);
    examList.columns.add('option1', sql.NVarChar);
    examList.columns.add('option2', sql.NVarChar);
    examList.columns.add('option3', sql.NVarChar);
    examList.columns.add('option4', sql.NVarChar);
    examList.columns.add('answer', sql.NVarChar);
    for (let record of array){
        examList.rows.add(record.question, record.option1,record.option2,record.option3,record.option4,record.answer);
    }
    return examList;
}

const UserQuestionListTvp = (array) => {
    const userQuestionList = new sql.Table('UserQuestionList');
    userQuestionList.columns.add('question_id', sql.BigInt);
    userQuestionList.columns.add('exam_id', sql.BigInt);
    userQuestionList.columns.add('answer', sql.NVarChar);
    userQuestionList.columns.add('user_id', sql.BigInt);
    for (let record of array){
        userQuestionList.rows.add(record.question_id, record.exam_id,record.answer,record.user_id);
    }
    return userQuestionList;
}

module.exports = {ExamListTvp,UserQuestionListTvp};