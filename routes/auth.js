const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET}= require('../keys')
const loginMiddleware = require('../middleware/loginMiddleware')


router.get('/protected',loginMiddleware,(req,res)=> {
    res.send('Welcome user')
})



router.post('/signup',(req,res)=>{
   const {name,email,password} = req.body
   if(!email || !name || !password) {
       return res.status(422).json({error :'Please fill all required fields'})
   }
   User.findOne({email:email})
   .then((savedUser)=> {
       if(savedUser){
        return res.status(422).json({error :'Email already excist'})
       }

       bcrypt.hash(password,12)
       .then(hashedpassword=> {
        const user = new User({
            name,
            email,
            password:hashedpassword
        })
        user.save(user => {
            res.json({message: "User saved to db"})
        })
       })
      
       .catch(err => {
           console.log(err);
       })
   })
  
})

router.post('/signin',(req,res)=> {
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:'Please fill in the required fields'})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
        return res.status(422).json({error:'Invalid credentials'})
        }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
            //res.json({message:'Succesfully signed in'})
            const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
            res.json({token})
        }
        else{
            return res.status(422).json({error:'Invalid credentials'})
        }
    })
    .catch(err=>{
        console.log(err);
    })
})
})

module.exports = router