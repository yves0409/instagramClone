const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const loginMiddleware = require('../middleware/loginMiddleware')
const Post = mongoose.model('Post')


//Create a post route

router.post('/createpost',loginMiddleware,(req,res)=>{
    const {title,body} = req.body

    if(!title || !body) {
        res.status(422).json({error: "Please fill in the required fileds"})
    }
    
    req.user.password = undefined   //this will prevent the password being stored in the DB
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result => {
        res.json({post:result})
    })
    .catch(err=> {
        console.log(err);
    })
})

//Get all posts route

router.get('/allposts',(req,res)=>{
    Post.find()
    .populate('postedBy','_id name')
    .then(posts => {
        res.json({posts:posts})
    })
    .catch(err => {
        console.log(err);
    })
})


module.exports = router