// const passport = require('passport')
const User = require('../models/user.model')
const Article = require('../models/article.model')
const Category = require('../models/category.model')
const bcrypt = require('bcrypt')
const randomToken = require('random-token')
const Reset =  require('../models/reset.model')
const { resolve } = require('path')
const { rejects } = require('assert')

module.exports = {
    getLogin : (req,res,next)=> {
        res.render('login',{verifUser:req.session.userId});
    },
    login: (req, res, next) => {
        
        return new Promise((resolve, reject) => {
            User.findOne({email:req.body.email})
            .then((user)=> {
                if (user) {
                    return bcrypt.compare(req.body.password, user.password)
                    .then((verif)=> {
                        if(verif) {
                            resolve(user._id)
                        }
                        else {
                            reject('invalid password')
                        }
                    }) 
                }
                else {
                    reject('check your email please')
                }
            })
            .catch((err)=> {
                reject(err)
                return res.redirect('/users/login')
            })
        })
        .then((id)=> {
            // console.log('wiem', id)
            req.session.userId = id
            return req.session.save((err)=> {
                // console.log(err)
                res.redirect('/users/dashborad')
            })           
        })
        .catch((err)=> {
            req.flash('error', 'thank you to check our information please');
            return res.redirect('/users/login')
        })

    },

    getSignUp : (req,res,next)=> {
        res.render('sign-up');
    },

    signup: (req, res, next) => {
       // console.log('test sign-up page')
        return new Promise((resolve, reject) => {
            User.findOne({email : req.body.email})
               .then((user)=> {
                   if(user) {
                       reject('email is used')
                   }
                   else {
                            return hPassword = bcrypt.hash(req.body.password,10)  
                            .then((hPassword)=>{
                                let user = new User ({
                                     username : req.body.username,
                                     firstname : req.body.firstname,
                                     lastname : req.body.lastname,
                                     email : req.body.email,
                                     password:hPassword,
                                     //passwordConfirm: req.body.passwordConfirm
                                })
                                user.save()
                                .then((user)=> {
                                    resolve('rejistered !!')
                                })
                            })
                   }
               })
               .catch((err)=> {
                   reject(err)
               })
           })
           .then((user)=> {
            req.flash('success', 'cool, you are now connected !');
            res.redirect('/users/login')
           })
           .catch((err)=> {
             req.flash('error', 'email is used');
             //console.log(req.flash('error')[0])
            res.redirect('/users/sign-up');
           })
            // const newUser = new User({
            //     username : req.body.username,
            //     firstname : req.body.firstname,
            //     lastname : req.body.lastname,
            //     email : req.body.email
            // })

            // User.register(newUser, req.body.password, (err, user) => {
            //     if(err) {
            //         console.log(err.message)
            //         req.flash('error', err.message);
            //         return res.redirect('/users/sign-up')
            //     }
            //     passport.authenticate("local")(req,res,(err, newUser)=> {
            //         if(err) {
            //             req.flash('error', err.message);
            //             return res.redirect('/users/sign-up')
            //         }
            //         console.log(user,'eeeeeeeee')
            //         req.flash('success', 'cool, you are now connected !');
            //         return res.render('index',{User:User});
            //     })
            //     // Authentification
            //    // console.log(user); 
            // })
            //next()

        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        //     // Store hash in your password DB.
        //     if(err) {
        //         req.flash('error',err.message)
        //         res.redirect('/users/sign-up');
        //     }
        //     const newUser = new User({
        //         ...req.body,
        //         password: hash
        //     })
        //     newUser.save()
        //     .then(()=> {
        //         req.flash('success', 'your compte has been created with success')
        //         res.redirect('/users/login');
        //     })
        //     .catch((err)=> {
        //         req.flash('error', err.message)
        //         res.redirect('/users/sign-up');
        //     })
        // });
    },

    resetPassword: (req,res,next) => {
        User.findOne({email : req.body.email})
    
        .then((user)=> {
           
            if (user) {
                //Creation token
                const token = randomToken(32);
                let reset = new Reset ({
                    email : req.body.email, 
                    resetPasswordToken: token,
                    resetExpires: Date.now() + 360000
                })
                // email de réinitialisation
                /*1min = 60s  1h = 60s  => 1h = 60*60 == 3600s  1h = 360000ms
                resetExpires expire aprés 1h
                */
                reset.save()
               .then(()=> {
                req.body.email = user.email;
                req.body.message = "<h3>Hello "+user.username+"</h3>click this link to reset your password : <br>"+req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;
                //console.log('wiiiem')
                next()
               })
               .catch((err)=> {
                req.flash('error', err.message)
                return res.redirect('/users/forgot-password')
               })
            }
            else {
                req.flash('error', 'email not found!')
                return res.redirect('/users/forgot-password')
            }
        })
        .catch((err)=>{
            req.flash('error',err.message)
            return res.redirect('/users/forgot-password')
        })
    },

    resetPasswordForm: (req,res,next) => {
        const token = req.params.token;
        Reset.findOne({resetPasswordToken : token, resetExpires: {$gt : Date.now()}})
        .then((reset)=> {
            if(reset) {
                //req.flash('success','add a new password please') 
                res.render('reset-password-form')
            }
            else {
                //console.log('not validtessst')
                req.flash('error','Your token is invalid, Please enter your email and ask again !') 
                return res.redirect('/users/forgot-password')
            }
            
        })
        .catch((err)=> {
           req.flash('error','token invalid') 
           return res.redirect('/users/forgot-password')
        })
    },

    postResetPassword : (req,res, next) => {
        const token = req.params.token;
        Reset.findOne({resetPasswordToken : token, resetExpires: {$gt : Date.now()}})
        .then((reset)=> {
                email = reset.email
                User.findOne ( {email : email})
                .then((user)=> { 
                    return hpassword = bcrypt.hash(req.body.password, 10)
                    .then((hpassword)=> {
                        user.password = hpassword
                        user.save()
                        .then(()=> {
                            Reset.deleteMany({email : user.email})
                            .then(()=> {
                                req.flash('success', 'your password changed with success')
                                return res.redirect('/users/login')
                            })
                            .catch((err)=> {
                                req.flash('error',err.message)
                                return res.redirect('/users/reset-password/'+token)
                            })
                        })
                    })
                })
        })
        .catch((err)=> {
            req.flash('error', err.message)
            return res.redirect('/users/reset-password/'+token)
        })
    },

    dashborad : (req, res, next) => {
        if (req.session.userId) {
            id = req.session.userId
            User.findOne({ _id : id})
            .then((user)=>{ 
                Article.find({author : req.session.userId}) 
                
                .then((articles)=> {
                    Category.find({author : req.session.userId}) 
                    .then((categories)=>{
                        if(articles,categories) {
                            return res.render('dashborad', ({user:user, verifUser:req.session.userId, articles : articles, categories:categories  }))
                        }
                        else {
                            return res.render('dashborad', ({user:user, verifUser:req.session.userId}))
                        }  
                    })
                    .catch((err)=> {
                        req.flash('error', err.message)
                        res.redirect('/')
                    })
                    
                })      
            })
            .catch((err)=> {
                req.flash('error', err.message)
                res.redirect('/')
            })
        }else {
            req.flash('error', err.message)
            res.redirect('/')
        }
    },


    chekEmailDuplicate : (req,res, next)=> {
        User.findOne({_id: {$ne: req.body.userId}, "email": req.body.email})
        .then((user)=> {
            if (user) {
                req.flash('error','email used !')
                return res.redirect('/users/dashborad')
            }
            else {
                next()
            }
        })
        .catch((err)=> {
            next()
        })
    },

    saveProfile : (req,res,next) => {
        if (req.session.userId) {
            id = req.session.userId
            if (id == req.body.userId) {
                User.findOne({ _id : id})
                .then((user)=> {
                    const oldEmail = user.email
                    user.username = req.body.username ? req.body.username : user.username;
                    user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
                    user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
                    user.email = req.body.email ? req.body.email : user.email;
                    user.save()
                    .then((user)=> {
                        if (oldEmail != user.email) {
                            return req.session.destroy(()=> {
                                res.redirect('/users/login')
                              })
                        }
                        else {
                            req.flash('success', "cool, our profile has been edited !")
                            return res.redirect('/users/dashborad')
                        }
                    })
                })
            }
        }
    },
}