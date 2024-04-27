import Result from '../models/result.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const saveResult = asyncHandler(async (req, res) => {
    // Check if user is logged in
    if(!req.user){
        throw new ApiError(401, 'Unauthorized', false)
    }

    const {maxMarks, obtMarks, subject, teacherName} = req.body
    if([String(maxMarks), String(obtMarks), String(subject), String(teacherName)].some(field => field.trim() === '')){
        throw new ApiError(400, 'All fields are required', false)
    }

    const result = await Result.create({
        maxMarks,
        obtMarks,
        subject,
        teacherName,
        student: req.user._id
    })

    if(!result){
        throw new ApiError(500, 'Failed to save result', false)
    }

    await result.save()

    res.status(201).json(new ApiResponse(201, 'Result saved successfully', true, result))
})

const getResults = asyncHandler(async (req, res) => {
    // Check if user is logged in
    if (!req.user) {
        throw new ApiError(401, 'Unauthorized', false);
    }

    let results;
    if (req.user.type === 'teacher') {
        // Fetch all results for teacher
        results = await Result.find().populate('student', 'name');
    } else {
        // Fetch results for student
        results = await Result.find({ student: req.user._id }).populate('student', 'name');
    }

    if (!results) {
        throw new ApiError(404, 'No results found', false);
    }

    res.status(200).json(new ApiResponse(200, 'Results found', true, results));
});


export {saveResult, getResults}


