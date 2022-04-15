var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const common=require('../config/common');
const constants=require('../config/constants');
const passport = require('passport');

/* GET users listing. */
router.get('/',async function(req, res, next) {
  res.render('shop/type_resgister');
});
router.get('/details/:id',async function(req, res, next) {
  var id=req.params.id;
  var info= await common.api_get(constants.url_server+"/users/info/"+id);
  var products_shop=await common.api_get(constants.url_server+"/products/list_user_id/"+id);
  var category_shop=await common.api_get(constants.url_server+"/categorys/getList_Parent_Product_User_ID/"+id);
  res.render('shop/shop_details',{info_shop:info,products_shop:products_shop,category_shop:category_shop});
});
router.get('/resgister_sell_domestic',async function(req, res, next) {
  res.render('shop/resgister_sell_domestic');
});
router.get('/resgister_sell_foreign',async function(req, res, next) {
  res.render('shop/resgister_sell_foreign');
});
router.get('/resgister_sell_trademark',async function(req, res, next) {
  res.render('shop/resgister_sell_trademark');
});


module.exports = router;
