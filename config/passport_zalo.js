
const ZaloStategy  = require('passport-zalo').Strategy;
const common=require('../config/common');
const constants=require('../config/constants');
// Load User model
module.exports =async function(passport) {
    passport.use(new ZaloStategy({
        clientID: constants.clientID_zalo,
        clientSecret:constants.clientSecret_zalo ,
        callbackURL: constants.auth_callbackurl_zalo,
        profileFields:['email','gender','locale','displayName','photos'],
        state: "test",
        },
        function(accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
            var user = await common.api_post(constants.url_server+'/users/save_zalo',{
                id_zalo:profile.id,
                name:profile.name,
                avatar:profile.picture.data.url,
            });
            return done(null, user);
        });
        }
    ));
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