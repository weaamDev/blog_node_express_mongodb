const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title:{type:String, required: true},
    image: {type:String, required:true},
    description: {type:String, required: true},
    article : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publishedAt: {type:Date, required: true}
})

module.exports = mongoose.model('Category', categorySchema);