import express from 'express'
import dotenv from 'dotenv'
import userRouter from './Routes/user.routes.js'

dotenv.config({
    path: './.env'
})

app.use('/', userRouter)

const app = express()

export default app