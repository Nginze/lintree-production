const express = require('express')
const router = express.Router()
const User = require('../User')
const passport = require('passport')
require('../passportConfig')(passport)

const isAuth = (req,res,next)=>{
    
    if(req.user){
        
        next()
    }
    else{
        res.json({isAuth:false})
    }
   
    
}

router.get('/users/:user',isAuth,(req,res)=>{
    email = req.params.user + "@gmail.com"
    User.findOne({email:email})
        .then((user)=>{
            res.json({links:user.links, isAuth:req.isAuthenticated()})
        })
        .catch((err)=>{
            res.json({})
            console.log(err)
        })
})

router.post('/delete/:user/:link_id', isAuth, (req,res)=>{
    email = req.params.user + "@gmail.com"
    User.findOneAndUpdate({email:email}, {"$pull": { "links": { "_id": req.params.link_id } }})
        .then((user)=>{
            console.log(user)
            res.status(200).json({msg:'Link deleted'})
        })
})

router.post('/links/:user',(req, res)=>{
    
    email = req.params.user + "@gmail.com"
    User.findOneAndUpdate({email:email},{
        $push : {
            links:{
                title:req.body.title,
                url:req.body.url
            }
        }
    })
        .then((user)=>{
            res.json({user})
            console.log('link added ')
        })
})
router.post('/logout/:user', (req,res)=>{
    email = req.params.user + "@gmail.com"
 
    User.findOne({email:email})
    .then((user) => {

        req.session.destroy()
        res.json({redirect:"/",ok:true})
      
    })
     .catch(err => console.log(err))
})


router.get('/auth',(req,res,)=>{
     req.session.destroy()

})
module.exports= router