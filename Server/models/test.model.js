import mongoose from 'mongoose'

const testSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    subject: {
        type: String,
        default: null
    }, 

    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }]
    
}, {timestamps: true})

export default mongoose.model('Test', testSchema)