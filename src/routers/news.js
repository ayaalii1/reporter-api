const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const multer=require('multer')
const News=require('../models/news')

const { findByIdAndDelete } = require('../models/reporter')

router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
      return  res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }

})

const upload=multer({
    limits:{
        fileSize:2000000
    },
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|jfif)$/)){
        return cb(new Error('please upload img'))
    }
    cb(null,true)
        }
    })

router.post("/newsimg/:id",auth,upload.single('img'),async(req,res)=>{
    try{
        const _id=req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
          return  res.status(404).send('Unable to find news')
        }
       
        news.img=req.file.buffer
         news.save()
      return  res.status(200).send("upload success")
    }
     
    catch(e){
        
        res.status(400).send(e.message)
    }
})


router.get('/news',auth,async(req,res)=>{
    try{

    await req.reporter.populate('news')
    res.status(200).send(req.reporter.news)
    
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
          return  res.status(404).send('Unable to find this news')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndUpdate({_id,owner:req.reporter._id},req.body,{
            new:true,
            runvalidators:true
        })
        if(!news){
            return res.status(404).send('No news')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/newsreporter/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
          return  res.status(404).send('Unable to find news')
        }
       await news.populate('owner')
        res.send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news= await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
           return res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.delete('/newsimg/:id',auth,upload.single('img'),async(req,res)=>{
    try{
        const _id = req.params.id
        const news= await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
           return res.status(404).send('No news is found')
        }
        news.img=null
        news.save()
        res.status(200).send("image deleted")
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



module.exports = router
