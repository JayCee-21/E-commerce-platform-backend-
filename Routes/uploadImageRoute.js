const router = require('express')
const uploads = require('../Middleware/uploadMiddleware')

const fileRouter = router()

fileRouter.post('/upload', uploads.single('image'), (req, res) => {
    if(req.file) {
        res.status(200).json({message: "File uploaded successfully", file: req.file})
    }
    else {
        res.status(400).json({message: "No file uploaded"})
    }
})

module.exports = fileRouter