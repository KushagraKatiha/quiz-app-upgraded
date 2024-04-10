import express from 'express'
import { Router } from 'express'
import { login, resSender } from '../controllers/user.controllers.js'

const userRouter = Router()

userRouter.get('/', resSender)
userRouter.get('/login', login)


export default userRouter