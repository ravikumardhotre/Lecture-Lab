const multer = require('multer');

const storage = multer.memoryStorage()

const singleFileUpload = multer({
    storage: storage

}).single('file')

const multiFileUpload = multer({
    storage: storage
}).array('files')

module.exports = {singleFileUpload,multiFileUpload}