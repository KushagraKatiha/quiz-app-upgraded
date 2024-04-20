import Question from '../models/question.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const createQuestions = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in 
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized', false)
        }

        // Check if user is a teacher 
        if (req.user.type !== 'teacher') {
            throw new ApiError(403, 'Forbidden', false)
        }

        const { questionText, options, correctOption, explanation, subject } = req.body

        if ([questionText, options, correctOption, explanation, subject].some(field => field.trim() === '')) {
            throw new ApiError(400, 'All fields are required', false)
        }

        if (options.length !== 4) {
            throw new ApiError(400, 'There must be exactly 4 options', false)
        }

        if (!options.every(option => option.trim() !== '')) {
            throw new ApiError(400, 'All options are required', false)
        }

        if (correctOption < 0 || correctOption > 4) {
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

        if (!question) {
            throw new ApiError(500, 'Failed to create question', false)
        }

        await question.save()

        res.status(201).json(new ApiResponse(201, 'Question created successfully', true, question))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const getAllQuestionsAsATeacher = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized', false)
        }

        // Check if user is a teacher
        if (req.user.type !== 'teacher') {
            throw new ApiError(403, 'Forbidden', false)
        }

        let questions;

        const { subject } = req.body

        if (!subject) {
            questions = await Question.find({ teacher: req.user._id })
        } else {
            questions = await Question.find({ teacher: req.user._id, subject })
        }

        if (!questions || questions.length === 0) {
            throw new ApiError(404, 'No questions found', false)
        }

        res.status(200).json(new ApiResponse(200, 'Questions fetched successfully', true, questions))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const getQuestionsAsAStudent = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized', false)
        }

        // Check if user is a student
        if (req.user.type !== 'student') {
            throw new ApiError(403, 'Forbidden', false)
        }

        const { subject, teacherName } = req.body

        const questions = await Question.find({ subject, teacher: teacherName }).select('-correctOption -explanation')

        if (!questions) {
            throw new ApiError(404, 'No questions found', false)
        }

        res.status(200).json(new ApiResponse(200, 'Questions fetched successfully', true, questions))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const deleteQuestionsofASubject = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized', false)
        }

        // Check if user is a teacher
        if (req.user.type !== 'teacher') {
            throw new ApiError(403, 'Forbidden', false)
        }

        const { subject } = req.body

        const questions = await Question.find({ subject, teacher: req.user._id }).select('-correctOption -explanation')

        if (!questions || questions.length === 0) {
            throw new ApiError(404, 'Question not found', false)
        }

        await Promise.all(questions.map(q => q.remove()))

        res.status(200).json(new ApiResponse(200, 'Question deleted successfully', true))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const deleteAllQuestions = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized', false)
        }

        // Check if user is a teacher
        if (req.user.type !== 'teacher') {
            throw new ApiError(403, 'Forbidden', false)
        }

        const questions = await Question.find({ teacher: req.user._id }).select('-correctOption -explanation')

        if (!questions || questions.length === 0) {
            throw new ApiError(404, 'Question not found', false)
        }

        await Promise.all(questions.map(q => q.remove()))

        res.status(200).json(new ApiResponse(200, 'All questions deleted successfully', true))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

export {
    createQuestions,
    getAllQuestionsAsATeacher,
    getQuestionsAsAStudent,
    deleteQuestionsofASubject,
    deleteAllQuestions
}
