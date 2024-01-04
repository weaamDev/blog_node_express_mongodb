const Category = require('../models/category.model');
const Article =  require('../models/article.model');

exports.addCategory = (req,res)=> {
    res.render('add-category',{verifUser:req.session.userId})
}

exports.addOneCategory = (req,res)=> {
    Category.findOne({title : req.body.title}) 
    .then((category)=> {
        if(category) {
            req.flash('error','error for our category')
            return res.redirect('/category/add-category')
        }
        else {
            var category = new Category({
                ...req.body,
                image:`${req.protocol}://${req.get('host')}/img/catalog/${req.file.filename}`,
                author : req.session.userId,
                publishedAt: Date.now()
            })
            
            category.save()
            .then((category)=>{
                req.flash('success','your category ha been added')
                return res.redirect('/category/add-category')
            })
            .catch((err)=> {
                req.flash('error','error for our category')
                return res.redirect('/category/add-category')
            })
        }
    })
}

exports.listCategory = (req,res)=> {
    Category.find({author : req.session.userId})
    .then((categories)=> {
        return res.render('list-category',{categories : categories, verifUser:req.session.userId})
    })
    .catch((err)=> {
        req.flash('error','error for our category')
        return res.redirect('/category/add-category')
    })
   
}


exports.editCategory = (req,res) => {
    Category.findOne({ _id : req.params.id})
    .then((category)=> {
        res.render('edit-category', {category:category, verifUser:req.session.userId})
    })
    .catch((err)=> {
        req.flash('error','error for our category')
        return res.redirect('/category/add-category')
    })
}

exports.editOneCategory = (req,res) => {
    const id = req.params.id
    Category.findOne({ _id : id})
    .then((category)=> {
        category.title = req.body.title ? req.body.title : category.title
        category.description = req.body.description ? req.body.description : category.description
        category.publishedAt = Date.now()
        category.save()
        .then(() => {
            req.flash('success', "cool, success for our category !")
            return res.redirect('/category/edit-category/'+id)
        })
        .catch((err)=> {
            req.flash('error',err.message)
            return res.redirect('/category/edit-category/'+id)
        })
    })
    .catch((err)=> {
        req.flash('error','error for our category')
        return res.redirect('/category/add-category')
    })
}

exports.deleteOneCategory = (req,res)=> {
    const id = req.params.id
    Category.deleteOne({ _id : id})
    .then(()=> {
        req.flash('success', 'your article has been removed with success')
        return res.redirect('/users/dashborad')
    })
    .catch(()=> {
        req.flash('error',"you can't deleted this article")
        return res.redirect('/')
    })
}

exports.getArticleInCategory = (req, res)=> {
    Article.find({category : req.params.id })
        .then((articles)=> {
            if(articles) {
                res.render('articles-by-categ',{articles:articles,verifUser:req.session.userId })
            }
            else {
                req.flash('error',"empty list of product please add new product")
                return res.redirect('/add-article')
            }
        })
        .catch(()=> {
            req.flash('error',"empty list of product please add new product")
                return res.redirect('/add-article')
        })
}