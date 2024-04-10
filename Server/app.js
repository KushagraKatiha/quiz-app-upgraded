import express from 'express'
import dotenv from 'dotenv'
import resSender from './controllers/user.controllers.js'

dotenv.config({
    path: './.env'
})

const app = express()


app.get('/', resSender)





export default app