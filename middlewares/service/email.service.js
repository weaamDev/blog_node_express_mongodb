var nodemailer = require('nodemailer')
const Reset = require('../../models/reset.model')

sendResetEmail = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wiem.dammak29@gmail.com',
            pass: process.env.PASSWORD
        }
    })
    var message = "<br>Massege:"+req.body.message;
    const mailOptions = {
        from:'wiem.dammak29@gmail.com',
        to:  req.body.email,
        subject: "Reset your password",
         html: message
    }

    transporter.sendMail(mailOptions, (err,infos) => {
        if (err){
            console.log(err)
            req.flash('error',"Sorry your message could not be send, please try again later.")
            return res.redirect('/users/forgot-password')
    
           // next()
        } else{
            req.flash('success','Great, a reset email has been send to the address : '
            + req.body.email + ',please check your mailbox and click on the reset link')
             return res.redirect('/users/forgot-password')
            //next()
        }
    })
}

module.exports = sendResetEmail