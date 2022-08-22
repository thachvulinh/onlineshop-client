var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
var dateFormat = require('dateformat');
var config = require('config');
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
    var price_ship_min=0;
    if(product.info.services_ship && product.info.weight){
        var price_ship=await common.api_get(constants.url_server+"/delivery_prices/list_in_shipping_services_id?services_ship="+product.info.services_ship+"&weight="+product.info.weight+"&province_city="+info_address.use_shipping.value_province_city);
        (price_ship && JSON.stringify(price_ship)!="[]"? price_ship_min=price_ship[0]["min"]:'');
    }
    res.render('order/order',{product:product,product_price:product_price,quantity:quantity,info_address:info_address,price_ship_min:price_ship_min});
});
router.get('/detail/:id',ensureAuthenticated,async function(req, res, next) {
    var info=await common.api_get(constants.url_server+"/orders/info/"+req.params.id);
    res.render('order/order_detail',{info:info.info});
});
router.post('/insert',ensureAuthenticated,async function(req, res, next) {
    if(req.body.payment=="ATM"){
        var arr=new Array();
        arr=req.body;
        var date = new Date();
        var desc = 'Thanh toan don hang thoi gian: ' + common.format_date(date,2);
        var list_bank=[
                       //{value:'',name:'Không chọn'},
                       {value:'VNPAYQR',name:'Ngân hàng VNPAYQR'},
                       {value:'NCB',name:'Ngân hàng NCB'},
                       {value:'SCB',name:'Ngân hàng SCB'},
                       {value:'SACOMBANK',name:'Ngân hàng SACOMBANK'},
                       {value:'EXIMBANK',name:'Ngân hàng EXIMBANK'},
                       {value:'MSBANK',name:'Ngân hàng MSBANK'},
                       {value:'NAMABANK',name:'Ngân hàng NAMABANK'},
                       {value:'VISA',name:'Ngân hàng VISA'},
                       {value:'VNMART',name:'Ngân hàng VNMART'},
                       {value:'VIETINBANK',name:'Ngân hàng VIETINBANK'},
                       {value:'VIETCOMBANK',name:'Ngân hàng VIETCOMBANK'},
                       {value:'HDBANK',name:'Ngân hàng HDBANK'},
                       {value:'DONGABANK',name:'Ngân hàng Dong A'},
                       {value:'TPBANK',name:'Ngân hàng Tp Bank'},
                       {value:'OJB',name:'Ngân hàng OceanBank'},
                       {value:'BIDV',name:'Ngân hàng BIDV'},
                       {value:'TECHCOMBANK',name:'Ngân hàng Techcombank'},
                       {value:'VPBANK',name:'Ngân hàng VPBank'},
                       {value:'AGRIBANK',name:'Ngân hàng AGRIBANK'},
                       {value:'MBBANK',name:'Ngân hàng MBBank'},
                       {value:'ACB',name:'Ngân hàng ACB'},
                       {value:'OCB',name:'Ngân hàng OCB'},
                       {value:'SHB',name:'Ngân hàng SHB'},
                       {value:'IVB',name:'Ngân hàng IVB'}]
                       arr["list_bank"]=list_bank;
                       arr["description"]=desc;
        res.render('order/order_vnpay', arr);
    }else{
        var result=await common.api_post(constants.url_server+"/orders/insert",req.body);
        res.redirect('/orders/list?status=-3');
    }
    
});
router.post('/insert_multip',ensureAuthenticated,async function(req, res, next) {
     var para=req.body;
     var {check_cart,user_id,payment,delivery_price,receiver,receiver_phone,receiver_address,receiver_postcode}=req.body;
     if(Array.isArray(check_cart)){
        check_cart.forEach(async function(id,key){
            var product_id=para["product_id_"+id];
            var product_price_id=para["product_price_id_"+id];
            var quantity=para["quantity_"+id];
            var delivery_price=para["ship_"+id];
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
            var delivery_price=para["ship_"+check_cart];
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
router.post('/create_payment_url', async function (req, res, next) {
    var para=new Array();
    para=req.body;
    var {amount,bankCode,orderType,orderDescription,language}=req.body;
    var template = (req.body.type_template?req.body.type_template:'');
    var ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log(req.headers['x-forwarded-for']);
    console.log(req.connection.remoteAddress);
     console.log(req.socket.remoteAddress);
      console.log(req.connection.socket.remoteAddress);
    var tmnCode = constants.vnp_TmnCode;
    var secretKey = constants.vnp_HashSecret;
    var vnpUrl = constants.vnp_Url;
    var returnUrl = constants.vnp_ReturnUrl;
    var date = new Date();
    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId =  dateFormat(date, 'yyyymmddHHmmss');
    if(language === null || language === ''){language = 'vn';}
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';para['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay'; para['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;para['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = language;para['vnp_Locale'] = language;
    vnp_Params['vnp_CurrCode'] = currCode; para['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;para['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = template+orderDescription; para['vnp_OrderInfo'] = template+orderDescription;
    vnp_Params['vnp_OrderType'] = orderType; para['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;para['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl; para['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr; para['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;para['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){vnp_Params['vnp_BankCode'] = bankCode;para['vnp_BankCode'] = bankCode;}
    vnp_Params = sortObject(vnp_Params);
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;para['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    await common.api_post(constants.url_server+"/orders/insert",para);
    res.redirect(vnpUrl);
});
router.get('/vnpay_return',async function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    var tmnCode = constants.vnp_TmnCode ;
    var secretKey = constants.vnp_HashSecret;
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    var info_vnp_orderinfo=vnp_Params["vnp_OrderInfo"];
    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if(vnp_Params['vnp_ResponseCode']=="00"){
            vnp_Params["vnp_OrderInfo"] = vnp_Params["vnp_OrderInfo"].replace('template_2',''); 
            await common.api_post(constants.url_server+"/orders/update_success_token",vnp_Params);
        }
        else{
            await common.api_post(constants.url_server+"/orders/delete_token",vnp_Params);
        }
        if(info_vnp_orderinfo.search("template_2") == -1){
            res.render('order/order_success', {code: vnp_Params['vnp_ResponseCode']})
        }
        else{
            res.redirect("http://demojs.atwebpages.com/#list_order?status=-3");
        }
    } else{
        await common.api_post(constants.url_server+"/orders/delete_token",vnp_Params);
        if(info_vnp_orderinfo.search("template_2") == -1){
            res.render('order/order_success', {code: '97'});
        }
        else{
            res.redirect("http://demojs.atwebpages.com/#list_order?status=-3");
        }
    }
});
router.get('/vnpay_ipn', function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    var secretKey = constants.vnp_HashSecret;
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
});
function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;
