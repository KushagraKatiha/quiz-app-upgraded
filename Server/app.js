import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/user.routes.js'
import testRouter from './Routes/test.routes.js'
import resultRouter from './Routes/result.routes.js'

dotenv.config({
    path: './.env'
})
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))  
app.use(cookieParser())

app.use('/api/user', userRouter)
// localhost:5000/api/user/USER_ROUTER

app.use('/api/test', testRouter)
// localhost:5000/api/test/TEST_ROUTER

app.use('/api/result', resultRouter)
// localhost:5000/api/result/RESULT_ROUTER

export default app