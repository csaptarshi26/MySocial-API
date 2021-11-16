import express from 'express';
import PostModel from '../models/Post.mjs'
import bcrypt from 'bcrypt'

const router = express.Router();

//CREATE A POST
router.post("/", async (req,res)=>{
    const newPost = new PostModel(req.body);
    try {
        const savedPost = await newPost.save();
        console.log(savedPost)
        res.status(200).json(savedPost);

    } catch (err) {
        res.status(500).json(err);
    }
})
//UPDATE A POST
//DELETE A POST
//LIKE A POST
//GET A POST
//GET TIMELINE POST

export default router;