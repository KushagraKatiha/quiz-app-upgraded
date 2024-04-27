
import {getResults, saveResult } from '../controllers/result.controller.js'
import jwtAuth from '../middleware/auth.middleware.js'
import { Router } from 'express'

const resultRouter = Router()

resultRouter.post('/save', jwtAuth, saveResult)
resultRouter.get('/get', jwtAuth, getResults)

export default resultRouter
