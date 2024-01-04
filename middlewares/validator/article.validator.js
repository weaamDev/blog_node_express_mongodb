const { Validator } = require('node-input-validator');


articleValidator = (req,res,next) => {
    if(req.file) {
        req.body.image = req.file.filename
    }
    const v = new Validator(req.body, {
        title: 'required',
        category: 'required',
        content: 'required',
        image: 'required',
      });
    
      v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          req.flash('errorForm',v.errors)
          res.redirect('/add-article');
          return
        }
        else {
          next();
        }
         // 
      });
}

module.exports = articleValidator;