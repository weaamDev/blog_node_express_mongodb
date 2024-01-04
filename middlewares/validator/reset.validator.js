const { Validator } = require('node-input-validator');
var path = require('path');


resetValidator = (req,res,next) => {
    const v = new Validator(req.body, {
      password: 'required',
      passwordConfirm: 'required|same:password',
      });
    
      v.check().then((matched) => {
        if (!matched) {
            console.log(v.errors)
          req.flash('errorForm',v.errors)
          return res.redirect('/users/'+req.path);
        }
        next();
      });
}

module.exports = resetValidator;