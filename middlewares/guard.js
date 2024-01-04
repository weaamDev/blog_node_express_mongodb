exports.guard = (req, res, next )=> {
    if(req.session.userId) {
        next();
    }
    else {
        req.flash('warning', 'Sorry, you must authenticate to access this page')
        return res.redirect('/users/login')
    }
}

exports.notguard = (req, res, next )=> {
    if(req.session.userId) {
        return res.redirect('/users/login')
    } else {
        next();
    } 
}

// exports.chekEmailDuplicate = (req, res, next) => {
//     if(req.session.Useremail) {
        
//     }
// }