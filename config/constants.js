var url_server=  "https://onlineshop-server.herokuapp.com";
var url_admin="http://localhost:3001";
var clientID_facebook="1160485638048278";
var clientSecret_facebook="5d8fb35dc605fadf48392a4828fe5e2a";
if(url_server!="http://localhost:5000"){
    url_admin="https://onlineshop-admin.herokuapp.com";
    clientID_facebook="597034575147107";
    clientSecret_facebook="720160694daff8aa607d4259e67614df";
}
module.exports = {
    "url_server" :url_server ,
    "url_admin":url_admin,

    "clientID_facebook":clientID_facebook,
    "clientSecret_facebook":clientSecret_facebook,

    "clientID_google":"178929450277-244in7qti54seoqhpprpv7ll5um33q53.apps.googleusercontent.com",
    "clientSecret_google":"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",

    "clientID_zalo":"153797579067901284",
    "clientSecret_zalo":"x546CYnbFPVO57PgMqFX",

};