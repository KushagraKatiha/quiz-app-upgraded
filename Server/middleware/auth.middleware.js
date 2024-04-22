import JWT from 'jsonwebtoken'
import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'

const jwtAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            throw new ApiError(401, 'Token not found !!', false);
        }
        
        const decodedToken = JWT.verify(accessToken, process.env.JWT_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, 'Can not decode !!', false);
        }

        const user = await User.findById(decodedToken.id).select('-password');
        if (!user) {
            throw new ApiError(401, 'User not found !!', false);
        }

        req.user = user;
        next();
    } catch (err) {
        next();
    }
}

export default jwtAuth;
