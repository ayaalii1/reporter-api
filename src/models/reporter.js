const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Timestamp } = require('mongodb')

const reporterSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true, 
        unique:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error ('Email is invalid')
           }
       }
    },
    adress:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error('Password must include uppercase,lowercase,numbers,speical character')
            }
        }
    },
    phone:{
        type:String,
        required:true,
        validate(value){
            
            if(!validator.isMobilePhone(value,"ar-EG")){
                throw new Error('Phone number is invalid')
            }
        }

    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
})



reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})
reporterSchema.plugin(Timestamp)

reporterSchema.statics.credentials = async (email,password) =>{

    const reporter = await Reporter.findOne(email)
    if(!reporter){
        throw new Error('Unable to login')
    }
    const isMatch = await bcryptjs.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return reporter
}


reporterSchema.pre('save',async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)
})

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'newscode')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}
reporterSchema.methods.toJSON = function(){

    const reporter = this
    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject
}


const Reporter = mongoose.model('reporter',reporterSchema)

module.exports=Reporter;