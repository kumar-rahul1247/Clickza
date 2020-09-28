const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API, EMAIL} = require('../config/keys')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

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
                            transporter.sendMail({
                                to: user.email,
                                from: "kumar.rahul1247@gmail.com",
                                subject: "signup successfully",
                                html: "<h2>Welcome To Clickza Sharing World</h2><br/>"+
                                        "<h3>Hey"+user.name+"</h3>"+
                                        "<h5>Enjoy and Share your Thoughts and Memories</h5>"
                            })
                            .then( res => {
                                console.log(res);
                                console.log("Message sent Successfully")
                            })
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
    console.log("I am SignIn")
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


router.post('/reset', ( req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log("--------CRYPTO ERROR-----")
            console.log(err)
        }
        const token = buffer.toString("hex");
        User.findOne({email: req.body.email})
            .then( user => {
                if(!user){
                    return res.status(200).json({error: "No User found with this Email Id. Please provide valid email"})
                }
                user.resetToken = token;
                user.expiryToken = Date.now() + 3600000

                user.save()
                    .then( result => {
                        transporter.sendMail({
                            to: req.body.email,
                            from: "kumar.rahul1247@gmail.com",
                            subject: "Password Reset",
                            html: `
                                <H2>Hi..!! You requested for passsword Reset.</h2>
                                <h5>Please <a href =${EMAIL}/${token}">CLICK ME</a>  yo reset your password</h5>`

                        })

                        res.json({message: "Please check your Email to Reset Password"})
                    })
            })
    })
})


router.post('/newpassword', (req, res) => {
    const newpwd = req.body.password;
    const sentToken = req.body.token;
    
    User.findOne({resetToken: sentToken, expireToken: {$gt:Date.now()}})
        .then( user => {
            if(!user){
                return res.status(422).json({error: "Try Again session expired"})
            }

            bcrypt.hash(newpwd,12)
                .then( hashpwd => {
                    user.password = hashpwd;
                    user.resetToken = undefined;
                    user.expireToken = undefined;

                    user.save()
                        .then( saveduser => {
                            res.json({message: "Password updated successfully.."});
                        })
                        .catch( err => {
                            console.log(err);
                        })
                })
        })
})


module.exports = router