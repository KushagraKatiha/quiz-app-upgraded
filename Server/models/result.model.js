import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
    maxMarks:{
        type: Number,
        required: true
    },
                                   
    obtMarks:{
        type: Number,
        required: true
    },

    subject:{
        type: String
    },

    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Result', resultSchema)