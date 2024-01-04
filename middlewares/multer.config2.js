const multer= require('multer')
const path= require('path')

const storageCatalog = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,path.join(__dirname,'../public/img/catalog'))
    },

    filename: function(req, file,cb) {
        cb(null,new Date().toISOString().replace(/:/g,"-")+ file.originalname)
    }
});

module.exports = multer({ storage : storageCatalog}).single('image');