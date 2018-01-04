//this is the file to register all routes 
//instead of placing them in app.js(starter file)
//this will call functions in User model

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database'); 

//Register routes
//that we can post to and register user with mongodb
router.post('/register', (req, res, next) =>{
    let newUser = new User({
        //name: 'Anjali',
        //email: 'anjaliprajapati3122@gmail.com',
        //username: 'anjali3122',
        //password: 'anjali3122'
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }); //now we have this new user object

    //and now  we wanna call the addUser function with it 
    //which we will put in model

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success: false, msg:"Failed to register user"});
        }else{
            res.json({success: true, msg:"User registered"}); 
        }
    })
    //res.send('REGISTER');
});

//Authenticate
//they can login and get back a json web token
router.post('/authenticate', (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password,(err, isMatch) =>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username:user.username,
                        email: user.email
                    }
                });
            } else{
                return res.json({success: false, msg : 'Wrong password'});
            }
        });
    });
});

//any route you wanna protect, put that in an second parameter
//we have protected profile route and user has to send the token to
//authorize
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) =>{
    res.json({user: req.user});
});


router.get('/foo', (req, res, next) =>{
    res.json({"foo":"foo"});
});


module.exports = router;