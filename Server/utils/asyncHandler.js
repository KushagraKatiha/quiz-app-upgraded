const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(err => next(err))
    }
}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next);
//     }catch(err){
//         new ApiError(500, 'Internal server error', false, null)
//     }
// }

export default asyncHandler