const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const Reporter = require('../models/reporter')
const multer = require('multer')


router.post('/signup',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
    
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

router.post('/login',async(req,res)=>{
    try{
        const reporter = await Reporter.credentials(req.body.email,req.body.password)
        const token  = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


const upload=multer({
    limits:{
        fileSize:1000000
    },
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|jfif)$/)){
        return cb(new Error('please upload your avatar'))
    }
    cb(null,true)
        }
    })

router.post('/profile/avatar',auth,upload.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar=req.file.buffer
        await req.reporter.save()
        res.send("success")
      
    }
    catch(e){
     console.log('error')
        res.send(e)
    }
})

router.patch('/reporter',auth,async(req,res)=>{
    try{
        
        const updates = Object.keys(req.body)
        updates.forEach((update)=>(req.reporter[update]=req.body[update]))
        await req.reporter.save()

        res.status(200).send(req.reporter)
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.reporter)
})


router.get('/reporter/:id',auth,async(req,res)=>{
    try{
         const _id = req.params.id
        const reporter = await Reporter.findById(_id)
        if(!reporter){
           return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
        }
     
    
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/reporter',auth,async(req,res)=>{
    try{
     const reporter=await Reporter.find({})
     
        res.status(200).send(reporter)}
     
    
    catch(e){
        res.status(500).send(e)
    }})


router.delete('/reporter/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
           return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e)
    }
    })
    
    router.delete('/reporter',auth,async(req,res)=>{
        try{
            req.reporter.remove()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })

    router.delete('/reporterimg',auth,async(req,res)=>{
        try{
            req.reporter.img = ""
            await req.reporter.save()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })

    router.delete('/reporterimage',auth,async(req,res)=>{
        try{
            req.reporter.image = ""
            await req.reporter.save()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })









    router.delete('/logout',auth,async(req,res)=>{
        try{
            req.reporter.tokens = []
            await req.reporter.save()
            res.send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })




module.exports = router
