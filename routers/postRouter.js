const router = require('express').Router()
const Post = require('./../models/postModel')
const checkAuth = require('./../middleware/Auth/checkAuth')

router.post('/post',checkAuth,async(req,res)=>{
    try {
        const {title,post} = req.body;
        if(!title||!post){
            return res.status(400).json({errorMessage:"Please enter all required field!"})
        }
        const newPost = new Post({
            title,post
        })
        const savedPost = await newPost.save()

        res.status(201).json({post:savedPost}).send()
    } catch (error) {
        res.status(500).json({errorMessage:error}).send()
    }
})

router.get('/posts',async(req,res)=>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({errorMessage:"Something went wrong"})
    }
})

module.exports = router