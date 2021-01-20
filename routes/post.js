const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const loginMiddleware = require('../middleware/loginMiddleware')
const Post = mongoose.model('Post')

router.post('/createpost',loginMiddleware,(req,res)=>{
    const {title,body} = req.body

    if(!title || !body) {
        res.status(422).json({error: "Please fill in the required fileds"})
    }
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


module.exports = router