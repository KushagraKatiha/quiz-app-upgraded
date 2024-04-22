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
    resetPassword,
} from '../controllers/user.controllers.js'
import jwtAuth from '../middleware/auth.middleware.js'
import { Router } from 'express'
import upload from '../middleware/multer.middleware.js'

const userRouter = Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/me',jwtAuth, getUser)
userRouter.get('/logout',jwtAuth, logout)
userRouter.delete('/delete',jwtAuth, deleted)
userRouter.put('/add-images', jwtAuth, upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]), uploadImage);
userRouter.put('/update', jwtAuth, update)
userRouter.put('/update-password', jwtAuth, updatePassword)
userRouter.post('/forget-password', forgetPassword)
userRouter.put('/reset-password/:forgetPasswordToken', resetPassword)

export default userRouter