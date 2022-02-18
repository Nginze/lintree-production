const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./User')
const verifyPassword = require('./passwordConfig')
const { deserializeUser } = require('passport')

module.exports = function(passport){passport.use('local', new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    (email,password, done) => {
         User.findOne({email:email})
            .then((user) => {

                if(!user){
                    return done(null, false)
                }
                if(verifyPassword(user.password, password)){
                    return done(null, user)
                }
                else{
                    return done(null, false)
                }
            
            })
             .catch(err => console.log(err))
                
            
     })
)

passport.serializeUser((user,done)=>{
 
    return done(null,user._id)
})

passport.deserializeUser((user_id, done)=>{

    User.findOne({_id:user_id})
        .then((user)=>{
            
            return done(null,user)
        })
        .catch(err => console.log(err))
})
}