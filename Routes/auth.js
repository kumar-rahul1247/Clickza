const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');


router.post('/signup', (req, res) => {
    console.log("Signup")
    const { name, email, password, profilePic } = req.body;
    console.log(req.body)
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" })
    }

    User.findOne({ email: email })
        .then((alreadyUser) => {
            if (alreadyUser) {
                return res.status(422).json({ error: "user already exists with this email" })
            }


            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        profilePic,
                        followers: [],
                        followings: []
                    });
                    console.log(user);
                    console.log(profilePic)
                    user.save()
                        .then(user => {
                            res.status(200).json({ message: "saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })

})


router.post('/signin', (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(422).json({error: "please add email or password"})
    }
    console.log("hi ")
    User.findOne({email:email})
        .then( savedUser => {
            if(!savedUser) {
                return res.status(422).json({error: "Invalid Email or password"});
            }

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        //res.json({message: "successfully signed in"})

                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        const {_id, name, email, followers, followings, profilePic} = savedUser;
                        console.log(savedUser)
                        res.json({
                                token, 
                                user: { _id, email, name, followers , followings, profilePic}
                            });
                    }
                    else {
                        return res.status(422).json({error: "Invalid Email or password"})
                    }
                })
        })
        .catch(err => {
            console.log(err.message);
        })
})

module.exports = router