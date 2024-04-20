import {
    register,
    login,
    getUser,
    logout,
    deleted,
    update,
    updatePassword,
    uploadImage,
    forgetPassword,
    resetPassword
} from '../controllers/user.controllers.js'
import jwtAuth from '../middleware/auth.middleware.js'
import { Router } from 'express'

const userRouter = Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/me',jwtAuth, getUser)
userRouter.get('/logout',jwtAuth, logout)
userRouter.delete('/delete',jwtAuth, deleted)


export default userRouter