import multer from 'multer';

// Function to determine the destination directory based on field name
const destination = (req, file, cb) => {
    if (file.fieldname === 'profileImg') {
        cb(null, 'public/temp/profileImages');
    } else if (file.fieldname === 'coverImg') {
        cb(null, 'public/temp/coverImages');
    } else {
        cb(new Error('Invalid field name'));
    }
};

const storage = multer.diskStorage({
    destination: destination, // Use the dynamic destination function
    filename: (req, file, cb) => {
        cb(null, req.user.name.split(" ").join('-') + Math.floor(Math.random()*10+1) + "." + file.mimetype.split('/')[1]);
    }
});

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

export default upload;
