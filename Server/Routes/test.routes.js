import {
    createQuestions,
    getAllQuestionsAsATeacher,
    getQuestionsAsAStudent,
    deleteQuestionsofASubject,
    deleteAllQuestions
} from '../controllers/test.controller.js'
import jwtAuth from '../middleware/auth.middleware.js'
import { Router } from 'express'

const testRouter = Router()

testRouter.post('/create', jwtAuth, createQuestions)
testRouter.get('/teacher/get', jwtAuth, getAllQuestionsAsATeacher)
testRouter.get('/student/get', jwtAuth, getQuestionsAsAStudent)
testRouter.delete('/delete', jwtAuth, deleteQuestionsofASubject)
testRouter.delete('/deleteAll', jwtAuth, deleteAllQuestions)

export default testRouter
