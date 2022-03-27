var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET users listing. */
router.get('/list',ensureAuthenticated,async function(req, res, next) {
    var list= await common.api_get(constants.url_server+"/cart/list/"+req.user._id);
    var info_address=await common.api_get(constants.url_server+"/users/info_address_use_shipping_billing/"+req.user._id);
    res.render('cart_list',{cart_list:list,info_address:info_address});
});

router.get('/delete/:id',async function(req, res, next) {
    var id=req.params.id;
    var info_products= await common.api_get(constants.url_server+"/cart/delete/"+id);
    res.redirect(req.get('referer'));
});

module.exports = router;
