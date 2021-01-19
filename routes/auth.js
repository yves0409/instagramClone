const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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

module.exports = router