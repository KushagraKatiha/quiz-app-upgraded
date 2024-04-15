import express from 'express'
import dotenv from 'dotenv'
// import cors from 'cors'
import userRouter from './Routes/user.routes.js'

dotenv.config({
    path: './.env'
})
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRouter)
// localhost:5000/api/user/USER_ROUTER

export default app