//var express = require('express')
var express = require('express')
const categoryController = require('../controllers/category.controller')
const multerConfig2 = require('../middlewares/multer.config2')
const Guard = require('../middlewares/guard')
const categoryValidator = require('../middlewares/validator/category.validator')
var router = express.Router()


router.get('/add-category',Guard.guard,categoryController.addCategory);
router.post('/add-category',Guard.guard,multerConfig2,categoryValidator, categoryController.addOneCategory);
router.get('/list-category',Guard.guard, categoryController.listCategory);
router.get('/edit-category/:id', categoryController.editCategory);
router.post('/edit-category/:id', categoryController.editOneCategory);
router.get('/delete-category/:id', categoryController.deleteOneCategory);
router.get('/:id',Guard.guard, categoryController.getArticleInCategory);
module.exports = router;