const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const Reporter=require('./reporter')

const newsSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    img:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"reporter"
    }
})
const News=mongoose.model("news",newsSchema)
newsSchema.plugin(Timestamp)
module.exports = News