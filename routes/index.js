var express = require('express');
const articleController = require('../controllers/article.controller')
const articleValidator = require('../middlewares/validator/article.validator')
const multerConfig = require('../middlewares/multer.config1')
const Guard = require('../middlewares/guard')
var router = express.Router();




/* GET home page. */
router.get('/',articleController.listArticle);

router.get('/about',(req,res)=> {
    res.render('about', {verifUser:req.session.userId})
})

router.get('/contact',(req,res)=> {
    res.render('contact', {verifUser:req.session.userId})
})

router.get('/article/:id',Guard.guard,articleController.showArticle);
router.get('/list-article',Guard.guard,articleController.ListAllArticle);

router.get('/add-article',Guard.guard,articleController.addArticle);
router.post('/add-article',Guard.guard, multerConfig, articleValidator, articleController.addOneArticle);
router.get('/edit-article/:id',Guard.guard, articleController.editArticle )

router.post('/edit-article/:id',multerConfig,Guard.guard, articleController.editOneArticle )
router.get('/delete-article/:id',Guard.guard, articleController.deleteOneArticle )


module.exports = router;
