var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
const passport = require('passport');
/* GET home page. */
router.get('/',async function(req, res, next) {
  var list_carousels= await common.api_get(constants.url_server+"/carousels/listall");
  var list_newproduct=await common.api_get(constants.url_server+"/products/list_new?limit=10");
  var list_topproduct=await common.api_get(constants.url_server+"/products/list_top?limit=10");
  var list_shop=await common.api_get(constants.url_server+"/users/list_shop");
  var list_posts=await common.api_get(constants.url_server+"/posts/list_new_posts?limit=3");
  res.render('index',{list_carousels:list_carousels,list_shop:list_shop,list_newproduct:list_newproduct,list_topproduct:list_topproduct,list_posts:list_posts});
});
router.get('/introduce',async function(req, res, next) {
  var info=await common.api_get(constants.url_server+"/introduces/info_use");
  res.render('introduce',{info:info});
});
router.get('/login',async function(req, res, next) {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {successRedirect: '/',failureRedirect: '/login',failureFlash: true})(req, res, next);
});
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
//
router.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),function(req, res) {res.redirect('/');
});
//google
router.get('/auth/google',passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect : '/', failureRedirect: '/login' }),function(req, res) {res.redirect('/');
});
//zalo
router.get('/auth/zalo',passport.authenticate('zalo', {
  scope: ['profile', 'email']
})
);
router.get('/auth/zalo/callback',
  passport.authenticate('zalo', { successRedirect : '/', failureRedirect: '/login' }),function(req, res) {res.redirect('/'); 
});
module.exports = router;
