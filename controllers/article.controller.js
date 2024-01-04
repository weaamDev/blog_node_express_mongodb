const Article =  require('../models/article.model');
const Category =  require('../models/category.model');
const User =  require('../models/user.model');
const fs = require('file-system')

exports.listArticle = (req, res) => {
    Article.find().limit(3)
    .then((articles)=>{
        Category.find()
        .then((categories)=> {
            res.render('index', { title: 'Express' ,'articles':articles, 'categories':categories,verifUser:req.session.userId});
        })
        
    })
    .catch((err)=>{
        res.status(200).json(err);
    });
}

exports.ListAllArticle = (req, res) => {
    Article.find()
    .then((articles)=>{
        Category.find()
        .then((categories)=> {
            res.render('list-article', { title: 'Express' ,'articles':articles, 'categories':categories,verifUser:req.session.userId});
        })
    })
    .catch((err)=>{
        res.status(200).json(err);
    });
}

exports.showArticle = (req,res)=> {
    Article.findOne({_id:req.params.id})
    .then((article)=> {
     res.render('single-article',{'article':article, verifUser:req.session.userId})
    })
    .catch((err)=> {
     res.redirect('/');
    })
}

exports.addArticle = (req, res) => {
    Category.find({author : req.session.userId})
    .then((categories)=> {
        res.render('add-article',{categories:categories, verifUser:req.session.userId})
    })
    .catch((err)=> {
        res.redirect('/')
    })
}

exports.addOneArticle = (req,res) => {
    Category.find({})
    var article = new Article({
        ...req.body,
        image:`${req.protocol}://${req.get('host')}/img/articles/${req.file.filename}`,
        author : req.session.userId,
        publishedAt: Date.now()
    })
    article.save()
    
    .then(()=>{
        req.flash('success','you article has been added with success goooddd')
        res.redirect('/add-article')
       
    })
    .catch((err)=>{
        req.flash('error','Echec for your article')
        res.redirect('/add-article')
    })
}

exports.editArticle = (req, res) => {
    if (req.session.userId) {
        const idArticle = req.params.id;
        Article.findOne({_id: idArticle , author : req.session.userId})
        .then((article)=>{
            if(article) {
                Category.find()
                .then((categories)=>{
                    return res.render('edit-article', {categories:categories, article:article, verifUser:req.session.userId})
                })
                .catch((err)=>{
                    req.flash('error',err.message)
                    return res.redirect('/')
                })
            } else {
                req.flash('error',"you can't modifié this article")
                    return res.redirect('/')
            }
        })
    }
}

exports.editOneArticle = (req, res) => {
    const id = req.params.id
    Article.findOne({_id: id , author : req.session.userId})
    .then((article)=>{
      
     if ( req.file) {
        const filename = article.image.split('/articles/')[1];
        //console.log(article.image)
        //console.log(filename)
        fs.unlink('./public/img/articles/'+filename,()=>{
            //console.log('Deleted: '+req.file.filename)
        })
    }
        article.title = req.body.title ? req.body.title : article.title;
        article.category = req.body.category ? req.body.category : article.category;
        article.content = req.body.content ? req.body.content :  article.content;
        article.image = req.file ? `${req.protocol}://${req.get('host')}/img/articles/${req.file.filename}` : article.image;
        article.save()
        .then(() => {
            req.flash('success', "cool, the article has been edited !")
            return res.redirect('/edit-article/'+id)
        })
        .catch((err)=> {
            req.flash('error',err.message)
            return res.redirect('/edit-article/'+id)
        })
    })
    .catch((err) => {
        req.flash('error',"you cant modifier this article")
        return res.redirect('/')
    })
}

exports.deleteOneArticle = (req,res) => {
    if (req.session.userId) {
        Article.findOne({ _id: req.params.id})
        .then((article)=> {
            const fileImage = article.image.split('/articles/')[1]
            fs.unlink('./public/img/articles/'+fileImage,()=>{
                console.log('file deleted successfully')
            })
            Article.deleteOne({_id : req.params.id,author: req.session.userId })
            .then((article)=> {
                 if(article.deletedCount != 0) {
                     req.flash('success', 'your article has been removed with success')
                     return res.redirect('/users/dashborad')
                 }
                 else {
                     console.log(article,'no article')
                     req.flash('error',"you can't deleted this article")
                     return res.redirect('/')
                 }
             })
        })
        .catch((err)=> {
            req.flash('error',"you can't deleted this article")
            return res.redirect('/')
        })
    }
}


