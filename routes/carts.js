var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET users listing. */
router.get('/list',ensureAuthenticated,async function(req, res, next) {
    var list= await common.api_get(constants.url_server+"/cart/list/"+req.user._id);
    var info_address=await common.api_get(constants.url_server+"/users/info_address_use_shipping_billing/"+req.user._id);
    if(JSON.stringify(list)){
        for(var i=0;i<list.length;i++){
            if(list[i].products[0].services_ship && list[i].products[0].weight){
                var price_ship=await common.api_get(constants.url_server+"/delivery_prices/list_in_shipping_services_id?services_ship="+list[i].products[0].services_ship+"&weight="+list[i].products[0].weight+"&province_city="+info_address.use_shipping.value_province_city);
                list[i].price_ship_min=(price_ship && JSON.stringify(price_ship)!="[]"? price_ship[0]["min"]:0);
            }
        }
    }
    res.render('cart_list',{cart_list:list,info_address:info_address});
});

router.get('/delete/:id',async function(req, res, next) {
    var id=req.params.id;
    var info_products= await common.api_get(constants.url_server+"/cart/delete/"+id);
    res.redirect(req.get('referer'));
});

module.exports = router;
