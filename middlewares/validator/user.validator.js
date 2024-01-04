const { Validator } = require('node-input-validator');


userValidator = (req,res,next) => {
    // if(req.file) {
    //     req.body.image = req.file.filename
    // }
    const v = new Validator(req.body, {
      username: 'required',
      firstname: 'required',
      lastname: 'required',
      email: 'required|email',
      password: 'required',
      passwordConfirm: 'required|same:password',
      });
    
      v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          //console.log(v.errors)
          req.flash('errorForm',v.errors)
          return res.redirect('/users/sign-up');
        }
        else {
          next();
        }
      });
    //  
}

module.exports = userValidator;