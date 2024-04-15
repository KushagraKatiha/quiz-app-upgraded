import {
    register,
    login,
    logout,
    deleted,
    update,
    updatePassword,
    uploadImage,
    forgetPassword,
    resetPassword
} from '../controllers/user.controllers.js'
import { Router } from 'express'

const userRouter = Router()

userRouter.post('/register', register)
userRouter.post('/login', login)


export default userRouter