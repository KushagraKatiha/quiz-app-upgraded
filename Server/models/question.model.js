import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },

    options: [{
        type: String,
        required: true
    }],

    correctOption: {
        type: Number,
        required: true
    },

    explanation: {
        type: String,
        required: true
    },

    subject:{
        type: String,
        required: true
    },   

    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {timestamps: true})

export default mongoose.model('Question', questionSchema)