var express = require('express');
const userController = require('../controllers/user.controller')
const userValidator = require('../middlewares/validator/user.validator')
const loginValidator = require('../middlewares/validator/login.validator')
const resetValidator = require('../middlewares/validator/reset.validator')
const Guard = require('../middlewares/guard')
const sendResetEmail = require('../middlewares/service/email.service')

var router = express.Router();

/* Login */
router.get('/login', Guard.notguard, userController.getLogin)

router.post('/login', loginValidator, userController.login);

/* Reset Password */
router.get('/forgot-password',(req,res)=> {
  res.render('forgot-password')
})
router.post('/forgot-password',userController.resetPassword, sendResetEmail)

router.get('/reset-password/:token',Guard.notguard, userController.resetPasswordForm)
router.post('/reset-password/:token', resetValidator, userController.postResetPassword)



/* sign-up */
router.get('/sign-up',Guard.notguard, userController.getSignUp)

router.post('/sign-up',userValidator, userController.signup)

/* Dashbord */
router.get('/dashborad',Guard.guard,  userController.dashborad)

router.post('/save-profile', userController.chekEmailDuplicate, userController.saveProfile )
/* logout */

router.get('/logout', (req,res)=> {
  req.session.destroy(()=> {
    // req.flash('success', 'you are disconnected ! ')
    res.redirect('/')
  })
})

module.exports = router;

