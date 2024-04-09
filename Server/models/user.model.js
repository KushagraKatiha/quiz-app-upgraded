import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    }, 

    email:{
        type: String,
        required: true,
        trim: true
    },

    type:{
        type: String, 
        required: true,
        default: 'student'
    }, 

    password:{
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long'],
        maxLength: [32, 'Password cannot be more than 32 characters long']
    },

    profileImg:{
        public_url:{
            type: String,
            default: null
        },

        secure_url:{
            type: String,
            default: null
        }
    },

    coverImg:{
        public_url:{
            type: String,
            default: null
        },

        secure_url:{
            type: String,
            default: null
        }
    }, 

    forgetPasswordToken:{
        type: String,
        default: null
    },
    
    forgetPasswordTokenExpiry:{
        type: Date,
        default: null
    }

}, { timestamps: true })

export default mongoose.model('User', userSchema)