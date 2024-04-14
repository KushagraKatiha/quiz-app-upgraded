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
        enum: ['student', 'teacher'],
        default: 'student'
    }, 

    password:{
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long'],
        maxLength: [32, 'Password cannot be more than 32 characters long']
    },

    profileImg:{
        type: String,   // cloudinary url
    },

    coverImg:{
        type: String,   // cloudinary url
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

userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return JWT.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

userSchema.methods.generateForgetPasswordToken = function(){
    const forgetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgetPasswordToken).digest('hex')
    const forgetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;
    this.forgetPasswordTokenExpiry = forgetPasswordTokenExpiry
    return forgetPasswordToken
}

export default mongoose.model('User', userSchema)