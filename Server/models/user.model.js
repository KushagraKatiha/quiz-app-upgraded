import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import JWT from 'jsonwebtoken'

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


userSchema.pre('save', async(next)=>{
    if(!this.isModified('password')){
        next()
    }
    try{
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }catch(error){
        next(error)
    }
})

userSchema.methods.checkPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password)
    }catch(error){
        throw new Error(error)
    }
}

userSchema.methods.generateAccessToken = async function(){
    return JWT.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

userSchema.methods.generateRefreshToken = function(){
    return JWT.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}

userSchema.methods.generateForgetPasswordToken = function(){
    const forgetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgetPasswordToken).digest('hex')
    const forgetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;
    this.forgetPasswordTokenExpiry = forgetPasswordTokenExpiry
    return forgetPasswordToken
}


export default mongoose.model('User', userSchema)