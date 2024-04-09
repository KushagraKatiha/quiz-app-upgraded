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

    test:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    }   

}, {timestamps: true})

export default mongoose.model('Question', questionSchema)