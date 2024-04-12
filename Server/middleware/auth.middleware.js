import JWT from 'jsonwebtoken'
import User from '../models/user.model.js'

const jwtAuth = async (req, _, next) => {
    const accessToken = req.cookies?.accessToken 
    if(!accessToken){
        throw new ApiError(401, 'Unauthorized', false)
    }
    try{
        const decodedToken = JWT.verify(accessToken, process.env.JWT_SECRET)
        
        if(!decodedToken){
            throw new ApiError(401, 'Unauthorized', false)
        }

        const user = await User.findById(decodedToken.id)
        
        req.user = user
        next()
    }catch(err){
        throw new ApiError(401, err.message || 'Unauthorized', false)
    }
}

export default jwtAuth