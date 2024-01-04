const { Validator } = require('node-input-validator');

categoryValidator = (req,res,next) => {
  if(req.file) {
    req.body.image = req.file.filename
  }
    const v = new Validator(req.body, {
        title: 'required',
        image: 'required',
        description: 'required',
      });
    
      v.check().then((matched) => {
        if (!matched) {
          req.flash('errorForm',v.errors)
           res.redirect('/category/add-category');
           return
        }
        else {
          next();
        }
      });
}

module.exports = categoryValidator;