import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp')
    }, 
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const multer = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
})

export default multer

