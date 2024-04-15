import app from './app.js'
import dbConnection from './config/dbConnection.js'
const PORT = process.env.PORT

dbConnection()
.then(()=>{
    app.on('error', (error)=>{
        console.log(`Error encountered: ${error}`)
        throw error
    })
    app.listen(PORT || 8000)
    console.log(`App is listning at http://localhost:${PORT}`);
})
.catch((err)=>{
    console.err(`Error connecting to database: ${err}`)
})