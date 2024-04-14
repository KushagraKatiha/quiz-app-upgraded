import User from '../models/user.model.js'
import Question from '../models/question.model.js'
import Test from '../models/test.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const createQuestions = asyncHandler(async (req, res) => {
    // Check if user is logged in 
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    // Check if user is a teacher 
    if(req.user.type !== 'teacher'){
        throw new ApiError(403, 'Forbidden', false)
    }

    const {questionText, options, correctOption, explanation, subject} = req.body

    if([questionText, options, correctOption, explanation, subject].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    if(options.length !== 4){
        throw new ApiError(400, 'There must be exactly 4 options', false)
    }

    if(!options.every(option => option.trim() !== '')){
        throw new ApiError(400, 'All options are required', false)
    }

    if(correctOption < 0 || correctOption > 4){
        throw new ApiError(400, 'Correct option must be between 0 and 4', false)
    }

    const question = await Question.create({
        questionText,
        options,
        correctOption,
        explanation,
        subject,
        teacher: req.user._id
    })

    if(!question){
        throw new ApiError(500, 'Failed to create question', false)
    }

    await question.save()

    res.status(201).json(new ApiResponse(201, 'Question created successfully', true, question))
})

const getAllQuestionsAsATeacher = asyncHandler(async (req, res) => {   // Teacher will get the questions he/she created with correct options and explanations
    // Check if user is logged in
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    // Check if user is a teacher
    if(req.user.type !== 'teacher'){
        throw new ApiError(403, 'Forbidden', false)
    }

    let questions; 

    const {subject} = req.body

    if(!subject){
        questions = await Question.find({teacher: req.user._id})
    }else{
        questions = await Question.find({teacher: req.user._id, subject})
    }

    res.status(200).json(new ApiResponse(200, 'Questions fetched successfully', true, questions))
})

const getQuestionsAsAStudent = asyncHandler(async (req, res) => {
    // Check if user is logged in
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    // Check if user is a student
    if(req.user.type !== 'student'){
        throw new ApiError(403, 'Forbidden', false)
    }

    const {subject, teacherName} = req.body
    
    const questions = await Question.find({subject, teacher: teacherName})

    if(!questions){
        throw new ApiError(404, 'No questions found', false)
    }

    res.status(200).json(new ApiResponse(200, 'Questions fetched successfully', true, questions))

})

const deleteQuestions = asyncHandler(async (req, res) => {
    // Check if user is logged in
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    // Check if user is a teacher
    if(req.user.type !== 'teacher'){
        throw new ApiError(403, 'Forbidden', false)
    }

    const {subject} = req.body

    const questions = await Question.find({subject, teacher: req.user._id})

    if(!questions || questions.length === 0){
        throw new ApiError(404, 'Question not found', false)
    }

    await Promise.all(questions.map(q => q.remove()))

    res.status(200).json(new ApiResponse(200, 'Question deleted successfully', true))
})

const deleteAllQuestions = asyncHandler(async (req, res) => {
    // Check if user is logged in
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    // Check if user is a teacher
    if(req.user.type !== 'teacher'){
        throw new ApiError(403, 'Forbidden', false)
    }

    const questions = await Question.find({teacher: req.user._id})

    if(!questions || questions.length === 0){
        throw new ApiError(404, 'Question not found', false)
    }

    await Promise.all(questions.map(q => q.remove()))

    res.status(200).json(new ApiResponse(200, 'All questions deleted successfully', true))
})
 
export {
    createQuestions,
    getAllQuestionsAsATeacher,
    getQuestionsAsAStudent,
    deleteQuestions,
    deleteAllQuestions
}