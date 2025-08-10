const multer = require('multer')
const path = require('path')


//dynamic folder based on mimetype

function getFolderByItsMimeType (mimeType) {
    if(mimeType.startsWith('image/')) {
        return 'uploads'
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploads = getFolderByItsMimeType(file.mimetype)
        cb(null, uploads)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


const uploads = multer({storage})
module.exports = uploads