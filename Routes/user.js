const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../Middleware/requireLogin');
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then( user => {
            Post.find({postedBy: req.params.id})
                .populate("postedBy", "_id name")
                .exec((err, post) => {
                    if(err){
                        return res.status(422).json({error: err})
                    }
                    res.json({user,post})
                })
        })
        .catch( err => {
            return res.status(422).json({error: "User Not Found.!"})
        })
})


router.put('/follow', requireLogin, (req, res)=> {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    },{
        new:true
    },(err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: {followings: req.body.followId}
        },{
            new: true
        })
        .select("-password")
        .then( result => {
            res.json(result)
        })
        .catch( err => {
            return res.status(200).json({error: err})
        })
    }
    
    ) 
})


router.put('/unfollow', requireLogin, (req, res)=> {
    User.findByIdAndUpdate(req.body.followId, {
        $pull: {followers: req.user._id}
    },{
        new:true
    },(err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id, {
            $pull: {followings: req.body.followId}
        },{
            new: true
        })
        .select("-password")
        .then( result => {
            res.json(result)
        })
        .catch( err => {
            return res.status(200).json({error: err})
        })
    }
    
    ) 
})


router.put('/updatepic', requireLogin, (req, res) => {

    console.log(req.user._id)
    console.log(req.body.profilePic)
    User.findByIdAndUpdate(req.user._id, {
        $set: {profilePic: req.body.profilePic}
    },{
        new: true
    })
    .then( result => {

        console.log(result);
        res.json(result);
    })
})

module.exports = router
