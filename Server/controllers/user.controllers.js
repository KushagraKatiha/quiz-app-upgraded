import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import emailValidator from 'email-validator'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import uploadToCloudinary from '../utils/cloudinary.js'
import sendMail from '../utils/sendEmail.js'

const register = asyncHandler(async (req, res) => {
    const {name, email, password, confirmPassword, type} = req.body

 
    if([name, email, password, confirmPassword, type].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    if(!emailValidator.validate(email)){
        throw new ApiError(400, 'Invalid email address', false)
    }

    if(password !== confirmPassword){
        throw new ApiError(400, 'Passwords do not match', false)
    }

    const userExisted = await User.findOne({email})
    if(userExisted){
        throw new ApiError(400, 'User with this email already exists', false)
    }

    const user = await User.create({
        name,
        email,
        password,
        type
    })

    if(!user){
        throw new ApiError(500, 'Failed to create user', false)
    }

    const userToBeSent = await User.findById(user._id).select('-password')

    user.save()

    res.status(201).json(new ApiResponse(201, 'User created successfully', true, userToBeSent))
 
})

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if([email, password].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    const isPasswordMatched = await user.checkPassword(password)
    if(!isPasswordMatched){
        throw new ApiError(400, 'Invalid email or password', false)
    }

    const accessToken = await user.generateAccessToken()

    const cookieOptions = {
        expireIn: process.env.JWT_EXPIRY,
        httpOnly: true
    }

    const userToBeSent = await User.findById(user._id).select('-password')

    res.status(200).cookie('accessToken', accessToken, cookieOptions).json(new ApiResponse(200, 'Login successful', true, userToBeSent ))
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken').json(new ApiResponse(200, 'Logout successful', true, null))
})

const deleted = asyncHandler(async (req, res) => {
    const user = req.user
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    const deletedUser = await User.findByIdAndDelete(user._id, {new: true})

    if(!deletedUser){
        throw new ApiError(500, 'Failed to delete user', false)
    }

    res.status(200).json(new ApiResponse(200, 'User deleted successfully', true, {name: deletedUser.name, email: deletedUser.email}))
    
})

const update = asyncHandler(async (req, res) => {
    const user = req.user
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    const {name, email} = req.body
    if(!name){
        // if there is no name in the request body, we will update only the email
        // check if the email is valid and unregisterd
        if(!emailValidator.validate(email)){
            throw new ApiError(400, 'Invalid email address', false)
        }

        const userExisted = await User.findOne({email}).select('-password')
        if(userExisted){
            throw new ApiError(400, 'User with this email already exists', false)
        }

        user.email = email
        await user.save({validateBeforeSave: false})
        res.status(200).json(new ApiResponse(200, 'User updated successfully', true, {name: user.name, email: user.email}))
    }

    if(!email){
        // if there is no email in the request body, we will update only the name
        user.name = name
        await user.save({validateBeforeSave: false})
        res.status(200).json(new ApiResponse(200, 'User updated successfully', true, {name: user.name, email: user.email}))
    }

    if(name && email){
        if(!emailValidator.validate(email)){
            throw new ApiError(400, 'Invalid email address', false)
        }

        const userExisted = await User.findOne({email}).select('-password')
        if(userExisted){
            throw new ApiError(400, 'User with this email already exists', false)
        }

        user.name = name
        user.email = email
        await user.save({validateBeforeSave: false})
        res.status(200).json(new ApiResponse(200, 'User updated successfully', true, {name: user.name, email: user.email}))
    }

})

const updatePassword = asyncHandler(async (req, res) => {
    const user = req.user
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    const {currentPassword, newPassword, confirmPassword} = req.body
    if([currentPassword, newPassword, confirmPassword].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    const isPasswordMatched = await user.checkPassword(currentPassword)

    if(!isPasswordMatched){
        throw new ApiError(400, 'Invalid current password', false)
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(400, 'Passwords do not match', false)
    }

    user.password = newPassword
    await user.save()

    res.status(200).json(new ApiResponse(200, 'Password updated successfully', true, null))
})

const uploadImage = asyncHandler(async (req, res) => {
    // Check if user is logged In 
    const user = req.user
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    // Check if the file is uploaded
    if(!req.file){
        throw new ApiError(400, 'Please upload a file', false)
    }

    const profileImgPath = req.files?.profileImage[0]?.path
    const coverImgPath = req.files?.coverImage[0]?.path
    // upload the file to the cloudinary 

    const profileImg = await uploadToCloudinary(profileImgPath)
    const coverImg = await uploadToCloudinary(coverImgPath)

    user.profileImage = profileImg?.url || user.profileImage
    user.coverImage = coverImg?.url || user.coverImage

    await user.save()

    res.status(200).json(new ApiResponse(200, 'Image uploaded successfully', true, {profileImage: user.profileImage, coverImage: user.coverImage}))
})

const forgetPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    if(!email){
        throw new ApiError(400, 'Email is required', false)
    }

    const user = await User.find({email})
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    const forgetPasswordToken = await user.generateForgetPasswordToken()

    await user.save()

    const resetPasswordLink = `http://localhost:${process.env.PORT}/user/reset-password/${forgetPasswordToken}`
    const content = `Click on the link below to reset your password\n${resetPasswordLink}`
    await sendMail(email, 'Reset Password', content)

    res.status(200).json(new ApiResponse(200, 'Forget password email sent successfully', true, null))
})

const resetPassword = asyncHandler(async (req, res) => {
    const {forgetPasswordToken} = req.params
    const {newPassword, confirmPassword} = req.body
    if([forgetPasswordToken, newPassword, confirmPassword].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(400, 'Passwords do not match', false)
    }

    const user = await User.find({forgetPasswordToken}, {forgetPasswordTokenExpiry: {$gt: Date.now()}})
    if(!user){
        throw new ApiError(404, 'User not found', false)
    }

    user.password = newPassword
    user.forgetPasswordToken = null
    user.forgetPasswordTokenExpiry = null

    await user.save()

    res.status(200).json(new ApiResponse(200, 'Password reset successfully', true, null))
})

export {
    register,
    login,
    logout,
    deleted,
    update,
    updatePassword,
    uploadImage,
    forgetPassword,
    resetPassword
}