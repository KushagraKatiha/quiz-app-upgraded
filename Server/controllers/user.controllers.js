import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import emailValidator from 'email-validator'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const register = asyncHandler(async (req, res, next) => {
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

const login = asyncHandler(async (req, res, next) => {
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

    const token = await user.generateAccessToken()

    const cookieOptions = {
        expireIn: process.env.JWT_EXPIRY,
        httpOnly: true
    }

    const userToBeSent = await User.findById(user._id).select('-password')

    res.status(200).cookie('token', token, cookieOptions).json(new ApiResponse(200, 'Login successful', true, userToBeSent ))
})