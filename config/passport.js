const LocalStrategy = require('passport-local').Strategy;
const common=require('../config/common');
const constants=require('../config/constants');

// Load User model
module.exports =async function(passport) {
    passport.use( 
        new LocalStrategy({ passReqToCallback: true },async function (req,username, password, done) {
            try
            {
                 var req = await common.api_post(constants.url_server+'/users/login',{type:req.body.type,username: username,password:password});
                 if(req.result==1){
                    return done(null, req.data);
                 }
                 else{
                    return done(null, false, { message: req.data });
                 }
            }
            catch(e)
            {
                console.log(`Failed: ${e}`);
            }
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
    // passport.deserializeUser(async function(id, done) {
    //     done(null, user);
    //     var info=await users_db.info({_id:id});
    //     if(!info){
    //         done('Please log in to view that resource', info);
    //     }
    //     else
    //     {
    //         done(null, info.toJSON()); 
    //     }
    // });
};