
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const common=require('../config/common');
const constants=require('../config/constants');
// Load User model
module.exports =async function(passport) {
      passport.use(
        new GoogleStrategy({
          clientID: constants.clientID_google,
          clientSecret: constants.clientSecret_google,
          callbackURL: constants.auth_callbackurl_google,
          profileFields:['email','gender','locale','displayName','photos']
        },function(accessToken, refreshToken, profile, done) {
            process.nextTick(async function () {
                var user = await common.api_post(constants.url_server+'/users/save_google',{
                    id_google:profile.id,
                    name:(profile.name.familyName?profile.name.familyName:'') + ' ' + (profile.name.givenName?profile.name.givenName:''),
                    email:profile.emails[0].value,
                    avatar:profile.photos[0].value,
                });
                return done(null, user);
            });
        })
      );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        //tại đây hứng dữ liệu để đối chiếu
        if (user) { //tìm xem có dữ liệu trong kho đối chiếu không
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
};