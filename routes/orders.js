var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET users listing. */
router.get('/details',ensureAuthenticated,async function(req, res, next) {
    var {product_id,product_price_id,user_id,quantity}=req.query;
    var product=await common.api_get(constants.url_server+"/products/info/"+product_id);
    var product_price=new Array();
    if(product_price_id!=""){
        product_price=await common.api_get(constants.url_server+"/products/info_price_products/"+product_price_id);
    }
    var info_address=await common.api_get(constants.url_server+"/users/info_address_use_shipping_billing/"+user_id);
    res.render('order/order',{product:product,product_price:product_price,quantity:quantity,info_address:info_address});
});
router.get('/detail/:id',ensureAuthenticated,async function(req, res, next) {
    var info=await common.api_get(constants.url_server+"/orders/info/"+req.params.id);
    res.render('order/order_detail',{info:info});
});
router.post('/insert',ensureAuthenticated,async function(req, res, next) {
    var result=await common.api_post(constants.url_server+"/orders/insert",req.body);
    res.redirect('/orders/list?status=-3');
});
router.post('/insert_multip',ensureAuthenticated,async function(req, res, next) {
     var para=req.body;
     var {check_cart,user_id,payment,delivery_price,receiver,receiver_phone,receiver_address,receiver_postcode}=req.body;
     if(Array.isArray(check_cart)){
        check_cart.forEach(async function(id,key){
            var product_id=para["product_id_"+id];
            var product_price_id=para["product_price_id_"+id];
            var quantity=para["quantity_"+id];
            await common.api_post(constants.url_server+"/orders/insert",{
                product_id:product_id,
                product_price_id:(product_price_id?product_price_id:''),
                quantity:quantity,
                user_id:user_id,
                payment:payment,
                delivery_price:delivery_price,
                receiver:receiver,
                receiver_phone:receiver_phone,
                receiver_address:receiver_address,
                receiver_postcode:receiver_postcode
            });
            await common.api_get(constants.url_server+"/cart/delete/"+id);
        });
     }
     else{
         if(check_cart){
            var product_id=para["product_id_"+check_cart];
            var product_price_id=para["product_price_id_"+check_cart];
            var quantity=para["quantity_"+check_cart];
            await common.api_post(constants.url_server+"/orders/insert",{
                product_id:product_id,
                product_price_id:(product_price_id?product_price_id:''),
                quantity:quantity,
                user_id:user_id,
                payment:payment,
                delivery_price:delivery_price,
                receiver:receiver,
                receiver_phone:receiver_phone,
                receiver_address:receiver_address,
                receiver_postcode:receiver_postcode
            });
            await common.api_get(constants.url_server+"/cart/delete/"+check_cart);
         }
     }
    res.redirect('/orders/list?status=-3');
});
router.get('/list',ensureAuthenticated,async function(req, res, next) {
    var status=req.query.status;
    var list_order=await common.api_get(constants.url_server+"/orders/list_user/"+req.user._id+"/"+status);
    res.render("order/order_list",{list_order:list_order,status:status});
});

module.exports = router;
