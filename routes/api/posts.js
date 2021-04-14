const express = require('express')
const router = express.Router();
const {body,validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profie')

// @route Post api/posts
// @desc  Create a Post
// @access Private
router.post('/',[auth,[
    body('text','Text is required').not().isEmpty()
]], async (req,res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {

        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        })        

        const post = await newPost.save()
        res.json(post)

    } catch (err) {
        console.error(err.msg)
        res.status(500).send('Server Error')
    }


})


// @route GET api/posts
// @desc  Get all posts
// @access Private

router.get('/',auth,async(req,res) =>{
    try {
        const posts = await Post.find().sort({date:-1})
        res.json(posts)
    } catch (err) {
        console.error(err.msg)
        res.status(500).send('Server Error')
    }
})


// @route GET api/posts/:id
// @desc  Get post by Id
// @access Private

router.get('/:id',auth,async(req,res) =>{
    try {
        const posts = await Post.findById(req.params.id)
        if(!posts){
            return res.status(404).json({msg:'No Post Found'})
        }
        res.json(posts)
    } catch (err) {
        console.error(err.msg)
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg:'No Post Found'})
        }
        res.status(500).send('Server Error')
    }
})


// @route DELETE api/posts/:id
// @desc  Delete post by Id
// @access Private

router.delete('/:id',auth,async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg:'Post Not Found'})
        }

        //Check user
        if(post.user.toString()!== req.user.id){
            return res.status(401).json({msg:'User Not authorized!'})
        }

        await post.remove()
        res.json({msg:'Post Delete Successfully'})
    } catch (err) {
        console.error(err.msg)
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg:'No Post Found'})
        }
        res.status(500).send('Server Error')
    }
})

// @route PUT api/posts/like/:id
// @desc  Like a post
// @access Private

router.put('/like/:id',auth,async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg:'Post already liked'})
        }

        post.likes.unshift({user:req.user.id})
        await post.save()
        res.json(post.likes);

    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

// @route PUT api/posts/unlike/:id
// @desc  Unike a post
// @access Private

router.put('/unlike/:id',auth,async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0){
            return res.status(400).json({msg:'Post is not unliked yet!'})
        }

        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1);

        await post.save()
        res.json(post.likes)
        

        await post.save()
        res.json(post.likes);

    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router