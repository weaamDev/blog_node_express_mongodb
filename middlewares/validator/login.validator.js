const { Validator } = require('node-input-validator');


loginValidator = (req,res,next) => {
    // if(req.file) {
    //     req.body.image = req.file.filename
    // }
    const v = new Validator(req.body, {
      email: 'required|email',
      password: 'required',
      });
    
      v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          //console.log(v.errors)
          req.flash('errorForm',v.errors)
          return res.redirect('/users/login');
        }
        next();
      });
}

module.exports = loginValidator;