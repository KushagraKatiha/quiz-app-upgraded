import {
    createQuestions,
    getAllQuestionsAsATeacher,
    getQuestionsAsAStudent,
    deleteQuestionsofASubject,
    deleteAllQuestions,
    getAllSubjects,
    getAllTeachers
} from '../controllers/test.controller.js'
import jwtAuth from '../middleware/auth.middleware.js'
import { Router } from 'express'

const testRouter = Router()

testRouter.post('/create', jwtAuth, createQuestions)
testRouter.get('/teacher/get', jwtAuth, getAllQuestionsAsATeacher)
testRouter.get('/student/get/:subject/:teacherName', jwtAuth, getQuestionsAsAStudent);
testRouter.delete('/delete', jwtAuth, deleteQuestionsofASubject)
testRouter.delete('/delete-all', jwtAuth, deleteAllQuestions)
testRouter.post('/attempt-quiz', jwtAuth, getQuestionsAsAStudent)
testRouter.get('/all-subjects', getAllSubjects)
testRouter.get('/all-teachers', getAllTeachers)

export default testRouter
