var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const common=require('../config/common');
const constants=require('../config/constants');
const passport = require('passport');

/* GET users listing. */
router.get('/general',ensureAuthenticated,async function(req, res, next) {
  var id=req.user._id;
  var info= await common.api_get(constants.url_server+"/users/info/"+id);
  var info_address= await common.api_get(constants.url_server+"/users/info_address_use_shipping_billing/"+id);
  res.render('users/users_general',{info:info,use_shipping:info_address["use_shipping"],use_billing:info_address["use_billing"]});
});
router.get('/address',ensureAuthenticated,async function(req, res, next) {
  var id=req.user._id;
  var list_address_user= await common.api_get(constants.url_server+"/users/list_address_user/"+id);
  res.render("users/users_address_list",{list_address_user:list_address_user});
});
router.get('/info',ensureAuthenticated,async function(req, res, next) {
  var id=req.user._id;
  var info= await common.api_get(constants.url_server+"/users/info/"+id);
  res.render("users/users_info",{info:info});
});
router.get('/update_session_user',ensureAuthenticated,async function(req, res, next) {
  var id=req.user._id;
  var info= await common.api_get(constants.url_server+"/users/info/"+id);
  req.user._id=info._id;
  req.user.name=(info.name?info.name:'');
  req.user.username=(info.username?info.username:'');
  req.user.avatar=(info.avatar?info.avatar:'');
  req.user.bgavatar=(info.bgavatar?info.bgavatar:'');
  req.user.phone=(info.phone?info.phone:'');
  req.user.address=(info.address?info.address:'');
  res.json(1);
});
router.get('/update_password',ensureAuthenticated,async function(req, res, next) {
  var id=req.user._id;
  var info= await common.api_get(constants.url_server+"/users/info/"+id);
  res.render("users/users_password",{info:info});
});
router.get('/resgister',async function(req, res, next) {
  res.render("users/users_resgister");
});
router.post('/resgister',async function(req, res, next) {
  var responsive=await common.api_post(constants.url_server+"/users/resgister",req.body);
  if(responsive["result"]==1){
    if(req.body.rank_id=="623c3926b16fd877d2f87f71"){
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
    }
    else{
        res.redirect(constants.url_admin+"/login");
    }
  }else{
    if(req.body.rank_id=="623c3926b16fd877d2f87f71"){
      res.render("users/users_resgister",{"error":responsive["message"],data:req.body});
    }
    else if(req.body.rank_id=="6242f207fd8a6b83bb4f0c49"){
      res.render("shop/resgister_sell_domestic",{"error":responsive["message"],data:req.body});
    }
    else if(req.body.rank_id=="6243525968810c11a154b677"){
      res.render("shop/resgister_sell_trademark",{"error":responsive["message"],data:req.body});
    }
    
  }
});
//shop

module.exports = router;
