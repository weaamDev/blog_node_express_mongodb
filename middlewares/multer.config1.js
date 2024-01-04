const multer= require('multer')
const path= require('path')

const storageProduct = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,path.join(__dirname,'../public/img/articles'))
    },

    filename: function(req, file,cb) {
        cb(null,new Date().toISOString().replace(/:/g,"-")+ file.originalname)
    }
});

module.exports = multer({ storage : storageProduct}).single('image');