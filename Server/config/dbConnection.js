import mongoose from 'mongoose'

const dbConnection = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`Database connected to ${connection.connection.host}`)
    } catch (error) {
        console.log(`Database connection failed: ${error.message}`);
        process.exit(1)
    }
}

export default dbConnection