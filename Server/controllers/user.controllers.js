import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import emailValidator from 'email-validator'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import {uploadToCloudinary, retryUpload } from '../utils/cloudinary.js'
import sendMail from '../utils/sendEmail.js'
import deleteFromCloudinary from '../utils/deleteFromCloudinary.js'
import crypto from 'crypto'

const sendWelcomeEmail = async (name, email, type) => {
    const subject = "Welcome to The Quizeee!";
    const content = `
    Dear ${name},

    Welcome to The Quizeee! We're thrilled to have you join us as a ${type}.

    With The Quizeee, you can:
    ${type === 'teacher' ? 
        '- Create and manage quizzes\n- Track student performance\n- Generate detailed reports' 
        : 
        '- Take quizzes at your convenience\n- Track your progress\n- View your performance analytics'}

    Get started by logging into your account and exploring our features.

    If you have any questions or need assistance, feel free to reach out to our support team.

    Best regards,
    The Quizeee Team
    `;

    await sendMail(email, subject, content);
};

const register = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, type } = req.body;

        if ([name, email, password, confirmPassword, type].some(field => field.trim() === '')) {
            throw new ApiError(400, "All fields are required !", false);
        }

        if (!emailValidator.validate(email)) {
            throw new ApiError(400, "Invalid Email !", false);
        }

        if (password !== confirmPassword) {
            throw new ApiError(400, "Passwords do not match !", false);
        }

        const userExisted = await User.findOne({ email });
        if (userExisted) {
            throw new ApiError(501, "User with this email already exists !", false);
        }

        const user = await User.create({
            name,
            email,
            password,
            type
        });

        if (!user) {
            throw new ApiError(500, "Failed to create user !", false);
        }

        // Send welcome email after successful registration
        try {
            await sendWelcomeEmail(name, email, type);
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
            // Don't throw error here, as registration was successful
        }

        const userToBeSent = await User.findById(user._id).select('-password');

        res.status(201).json(new ApiResponse(201, "User created successfully !", true, userToBeSent));
    } catch (error) {
        res.status(500).json(error);
    }
});

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;   
        if ([email, password].some(field => field.trim() === '')) {
            throw new ApiError(400, 'All fields are required', false);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        const isPasswordMatched = await user.checkPassword(password);
        if (!isPasswordMatched) {
            throw new ApiError(400, 'Invalid email or password', false);
        }

        const accessToken = await user.generateAccessToken();

        const cookieOptions = {
            expireIn: process.env.JWT_EXPIRY,
            httpOnly: true
        };

        const userToBeSent = await User.findById(user._id).select('-password');

        res.status(200).cookie('accessToken', accessToken, cookieOptions).json(new ApiResponse(200, 'Login successful', true, userToBeSent));
    } catch (error) {
        res.status(500).json(error);
    }
});

const getUser = asyncHandler(async (req, res) => {
    const user = req.user;
    try {
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }
        res.status(200).json(new ApiResponse(200, 'User found', true, user));
    } catch (error) {
        res.status(500).json(error);
    }
});

const logout = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in 
        if (!req.user) {
            throw new ApiError(401, 'Can not logout !', false);
        }
        res.clearCookie('accessToken').json(new ApiResponse(200, 'Logout successful', true, null));
    } catch (error) {
        res.status(500).json(error);
    }
});

const deleted = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        const deletedUser = await User.findByIdAndDelete(user._id, { new: true });

        if (!deletedUser) {
            throw new ApiError(500, 'Failed to delete user', false);
        }

        res.status(200).json(new ApiResponse(200, 'User deleted successfully', true, { name: deletedUser.name, email: deletedUser.email }));
    } catch (error) {
        res.status(500).json(error);
    }
});

const update = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        const { name, email } = req.body;
        if (!name) {
            // if there is no name in the request body, we will update only the email
            // check if the email is valid and unregisterd
            if (!emailValidator.validate(email)) {
                throw new ApiError(400, 'Invalid email address', false);
            }

            const userExisted = await User.findOne({ email }).select('-password');
            if (userExisted) {
                throw new ApiError(400, 'User with this email already exists', false);
            }

            user.email = email;
            await user.save({ validateBeforeSave: false });
            res.status(200).json(new ApiResponse(200, 'User updated successfully', true, { name: user.name, email: user.email }));
        }

        if (!email) {
            // if there is no email in the request body, we will update only the name
            user.name = name;
            await user.save({ validateBeforeSave: false });
            res.status(200).json(new ApiResponse(200, 'User updated successfully', true, { name: user.name, email: user.email }));
        }

        if (name && email) {
            if (!emailValidator.validate(email)) {
                throw new ApiError(400, 'Invalid email address', false);
            }

            const userExisted = await User.findOne({ email }).select('-password');
            if (userExisted) {
                throw new ApiError(400, 'User with this email already exists', false);
            }

            user.name = name;
            user.email = email;
            await user.save({ validateBeforeSave: false });
            res.status(200).json(new ApiResponse(200, 'User updated successfully', true, { name: user.name, email: user.email }));
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new ApiError(400, 'All fields are required', false);
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'Passwords do not match', false);
        }

        if (newPassword.length < 6) {
            throw new ApiError(400, 'New password must be at least 6 characters long', false);
        }
        const userWithPassword = await User.findById(user._id).select('+password');
        const isPasswordMatched = await userWithPassword.checkPassword(currentPassword);

        if (!isPasswordMatched) {
            throw new ApiError(400, 'Invalid current password', false);
        }

        userWithPassword.password = newPassword;
        
        await userWithPassword.save();

        res.status(200).json(new ApiResponse(200, 'Password updated successfully', true, null));
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

const uploadImage = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in 
        const user = req.user;
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        // Check if at least one file is uploaded
        if (!req.files || (!req.files['profileImg'] && !req.files['coverImg'])) {
            throw new ApiError(400, 'Please upload at least one image (profile or cover)', false);
        }

        let profileImgPath, coverImgPath;
        // Check if profile image is uploaded
        if (req.files['profileImg']) {
            profileImgPath = req.files['profileImg'][0].path;
        }
        // Check if cover image is uploaded
        if (req.files['coverImg']) {
            coverImgPath = req.files['coverImg'][0].path;
        }

        // Upload the files to Cloudinary if they exist, with retry logic
        let profileImg, coverImg;
        if (profileImgPath) {
            // Delete the existing profile image from Cloudinary
            if (user.profileImage) {
                await deleteFromCloudinary(user.profileImage);
            }
            profileImg = await retryUpload(profileImgPath);
        }
        if (coverImgPath) {
            // Delete the existing cover image from Cloudinary
            if (user.coverImage) {
                await deleteFromCloudinary(user.coverImage);
            }
            coverImg = await retryUpload(coverImgPath);
        }

        // Update the user's profile and cover image URLs
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: {
                profileImg: profileImg ? profileImg.url : user.profileImg || null,
                coverImg: coverImg ? coverImg.url : user.coverImg || null
            }},
            { new: true }
        ).select('-password');

        // Send success response with updated image URLs
        res.status(200).json(new ApiResponse(200, 'Images uploaded successfully', true, { profileImage: updatedUser.profileImg, coverImage: updatedUser.coverImg }));
    } catch (error) {
        res.status(500).json(error);
    }
});

const forgetPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new ApiError(400, 'Email is required', false);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        const forgetPasswordToken = await user.generateForgetPasswordToken();

        await user.save();

        const resetPasswordLink = `http://localhost:${process.env.CLIENT_PORT}/reset-password/${forgetPasswordToken}`;
        const content = `Click on the link below to reset your password\n${resetPasswordLink}`;
        await sendMail(email, 'Reset Password', content);
        res.status(200).json(new ApiResponse(200, 'Forget password email sent successfully', true, null));
    } catch (error) {
        res.status(500).json(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { forgetPasswordToken } = req.params;
        const { newPassword, confirmPassword } = req.body;
        if ([forgetPasswordToken, newPassword, confirmPassword].some(field => field.trim() === '')) {
            throw new ApiError(400, 'All fields are required', false);
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(400, 'Passwords do not match', false);
        }

        const forgetToken = crypto.createHash('sha256').update(forgetPasswordToken).digest('hex');
        const user = await User.findOne({ forgetPasswordToken: forgetToken ,  forgetPasswordTokenExpiry: { $gt: Date.now() } } ).select('+password');
        if (!user) {
            throw new ApiError(404, 'User not found', false);
        }

        user.password = newPassword;
        user.forgetPasswordToken = null;
        user.forgetPasswordTokenExpiry = null;

        await user.save();

        res.status(200).json(new ApiResponse(200, 'Password reset successfully', true, null));
    } catch (error) {
        res.status(500).json(error);
    }
});

const getUniqueTeacherNames = asyncHandler(async (req, res) => {
    try {
      // Aggregate pipeline stages
      const pipeline = [
        // Match documents where type is "teacher"
        { $match: { type: 'teacher' } },
        // Group documents by name and compute unique names
        { $group: { _id: '$name' } },
        // Project the _id field to name
        { $project: { _id: 0, name: '$_id' } }
      ];
  
      // Execute the aggregation pipeline
      const teacherNames = await User.aggregate(pipeline);
  
      // Respond with the unique teacher names
      res.json({ teacherNames });
    } catch (error) {
      // Handle errors
      console.error('Error fetching unique teacher names:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export {
    register,
    login,
    getUser,
    logout,
    deleted,
    update,
    updatePassword,
    uploadImage,
    forgetPassword, 
    resetPassword,
};
