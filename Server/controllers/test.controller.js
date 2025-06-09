import Question from '../models/question.model.js'
import Result from '../models/result.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const getSubjectsByTeacher = asyncHandler(async (req, res) => {
    try {
        const { teacherId } = req.params;

        const subjects = await Question.find({ teacher: teacherId }).distinct('subject');

        if (!subjects.length) {
            throw new ApiError(404, 'No subjects found for this teacher', false);
        }

        res.status(200).json(new ApiResponse(200, 'Subjects fetched successfully', true, subjects));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const getTeachersBySubject = asyncHandler(async (req, res) => {
    try {
        const { subject } = req.params;

        const teachers = await Question.find({ subject }).populate('teacher', 'name');

        let teacherNames = teachers.map(item => item.teacher?.name).filter(Boolean);
        teacherNames = [...new Set(teacherNames)];

        if (!teacherNames.length) {
            throw new ApiError(404, 'No teachers found for this subject', false);
        }

        res.status(200).json(new ApiResponse(200, 'Teachers fetched successfully', true, teacherNames));
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const getAllSubjects = asyncHandler(async (req, res) => {
    try {
        const subjects = await Question.find().distinct('subject')
        if (!subjects) {
            throw new ApiError(404, 'No subjects found', false)
        }

        res.status(200).json(new ApiResponse(200, 'Subjects fetched successfully', true, subjects))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

const getAllTeachers = asyncHandler(async (req, res) => {
    try {  
        const teachers = await Question.find().populate('teacher', 'name')
        let teacherNames = teachers.map(teacher => teacher.teacher.name);

        teacherNames = [...new Set(teacherNames)]
        if (!teachers) {
            throw new ApiError(404, 'No teachers found', false)
        }

        res.status(200).json(new ApiResponse(200, 'Teachers fetched successfully', true, teacherNames))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }

});

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

        if (!questionText || !options || !correctOption || !explanation || !subject) {
            throw new ApiError(400, 'All fields are required', false)
        }

        // check if no option is empty 
        if (options.some(option => !option || option.trim() === '')) {
            throw new ApiError(400, 'All options are required', false)
        }

        // check if all options are unique
        if (new Set(options).size !== options.length) {
            throw new ApiError(400, 'All options must be unique', false)
        }
        
        if (options.length !== 4) {
            throw new ApiError(400, 'There must be exactly 4 options', false)
        }

        if (correctOption < 1 || correctOption > 4) {
            throw new ApiError(400, 'Correct option must be between 1 and 4', false)
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

        let { subject, teacherName } = req.params

        subject = decodeURIComponent(subject)
        teacherName = decodeURIComponent(teacherName)

        const alreadyGiven = await Result.find({ student: req.user._id, subject, teacherName })
        if(alreadyGiven.length > 0){
            throw new ApiError(400, 'You have already attempted this test', false)
        }

        const questions = await Question.find().populate('teacher', 'name')

        const requiredQuestions = []

        questions.map(question => {
            if(question.teacher.name === teacherName && question.subject === subject) {
                requiredQuestions.push(question)
            }else{
                return;
            }
        }
        )


        if (!requiredQuestions) {
            throw new ApiError(404, 'No questions found', false)
        }

        res.status(200).json(new ApiResponse(200, 'Questions fetched successfully', true, requiredQuestions))
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
        const questions = await Question.deleteMany({ subject, teacher: req.user._id }, {new: true})

        res.status(200).json(new ApiResponse(200, 'Question deleted successfully', true, questions))
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

        const questions = await Question.deleteMany({ teacher: req.user._id })
        
        res.status(200).json(new ApiResponse(200, 'All questions deleted successfully', true, questions))
    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message, false));
    }
});

export {
    createQuestions,
    getAllQuestionsAsATeacher,
    getQuestionsAsAStudent,
    deleteQuestionsofASubject,
    deleteAllQuestions,
    getAllSubjects,
    getAllTeachers, 
    getSubjectsByTeacher, 
    getTeachersBySubject
}
