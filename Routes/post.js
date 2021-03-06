const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../Middleware/requireLogin');
const Post = mongoose.model('Post');

router.get('/allpost', requireLogin, ( req, res) => {
    Post.find()
        .populate("postedBy", "_id name profilePic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then( posts => {
            res.json({posts})
        })
        .catch( err => {
            console.log("Error : "+ err.message)
        })
    
})


router.get('/allsubspost', requireLogin, ( req, res) => {
    Post.find({postedBy: {$in: req.user.followings}})
        .populate("postedBy", "_id name profilePic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then( posts => {
            res.json({posts})
        })
        .catch( err => {
            console.log("Error : "+ err.message)
        })
    
})


router.post('/createpost', requireLogin, ( req, res ) => {
    
    const { title , body, pic } = req.body;
    console.log(title, body, pic)
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }
    console.log(req.user)

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user._id
    });

    post.save()
        .then( result => {
            res.status(200).json({post: result})
        })
        .catch( err => {
            console.log("Error "+ err.message)
        })


} )


router.get('/mypost', requireLogin, ( req, res) => {
    console.log(req.user)
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id email profilePic")
        .sort('-createdAt')
        .then( mypost => {
            res.json({mypost})
        })
        .catch( err => {
            console.log("error: "+err.message)
            res.status(422).json({error: err.message})
        })
})


router.put('/like', requireLogin, ( req, res) => {

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id }
    },{
        new : true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })

})


router.put('/unlike', requireLogin, ( req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id }
    },{
        new : true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })

})


router.put('/comment', requireLogin, ( req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment }
    },{
        new : true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })

})


router.delete('/delete/:postId', requireLogin, (req, res) => {

    Post.findOne({_id: req.params.postId})
        .populate("postedBy","_id")
        .exec((err, post) => {
            if(err || !post){
                console.log(post)
                return res.status(422).json({error:err})
            }
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                .then( result => {
                    console.log("Deleted Successfully")
                    res.status(200).json(result);

                })
                .catch( error => {
                    console.log(error)
                })
            }
        })
})




module.exports = router;