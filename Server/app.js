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

// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
//       res.status(err.statusCode).json({
//         success: err.success,
//         message: err.message,
//         data: err.data
//       });
//     } else {
//       // Handle other types of errors
//       res.status(500).json({
//         success: false,
//         message: "Internal Server Error"
//       });
//     }
//   });
  

app.use('/api/user', userRouter)
// localhost:5000/api/user/USER_ROUTER

export default app