var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');

/* GET home page. */
router.get('/list',async function(req, res, next) {
  var params=req.query;
  var user_id=req.query.user_id || '';
  var keywords=params.keywords || '';
  var min=(params.min?params.min.replace(/,/g,''):0) || 0;
  var max=(params.max?params.max.replace(/,/g,''):50000000) || 50000000;
  var sort=params.sort || 0;
  var id_category=params.id_category;
  var page = params.page || 1;
  var perPage=9;
  var skip=(perPage * page) - perPage;
  var info_category= await common.api_get(constants.url_server+"/categorys/info/"+id_category);
  var similar_category_list=await common.api_get(constants.url_server+"/categorys/list_Parent/"+info_category.parentID);
  var list_products= await common.api_post(constants.url_server+"/products/list_products_category",{id_category:id_category,min:min,max:max,sort:sort,page:page,perPage:perPage,keywords:keywords,user_id:user_id});
  res.render('products/products_list',{id_category:id_category,
                              list_products:(JSON.stringify(list_products.list)!="[]"?list_products.list:null),
                              similar_category_list:similar_category_list,
                              info_category:info_category,
                              user_id:user_id,
                              min:min,
                              max:max,
                              sort:sort,
                              current:page,
                              perPage:perPage,
                              pages:Math.ceil((JSON.stringify(list_products.all_list)!="[]"?list_products.all_list.length:0) / perPage),
                              total_products:(JSON.stringify(list_products.all_list)!="[]"?list_products.all_list.length:0),
                              skip_product:(JSON.stringify(list_products.list)!="[]"?skip:0),
                              keywords:keywords
                            });
});
router.get('/all',async function(req, res, next) {
  var params=req.query;
  var keywords=params.keywords || '';
  var user_id=req.query.user_id || '';
  var min=(params.min?params.min.replace(/,/g,''):0) || 0;
  var max=(params.max?params.max.replace(/,/g,''):50000000) || 50000000;
  var sort=params.sort || 0;
  var page = params.page || 1;
  var perPage=9;
  var skip=(perPage * page) - perPage;
  var list_products= await common.api_post(constants.url_server+"/products/list_products_category",{min:min,max:max,sort:sort,page:page,perPage:perPage,keywords:keywords,user_id:user_id});
  res.render('products/products_all',{list_products:(JSON.stringify(list_products.list)!="[]"?list_products.list:null),
                              min:min,
                              max:max,
                              user_id:user_id,
                              sort:sort,
                              current:page,
                              perPage:perPage,
                              pages:Math.ceil((JSON.stringify(list_products.all_list)!="[]"?list_products.all_list.length:0) / perPage),
                              total_products:(JSON.stringify(list_products.all_list)!="[]"?list_products.all_list.length:0),
                              skip_product:(JSON.stringify(list_products.list)!="[]"?skip:0),
                              keywords:keywords
                            });
});
router.get('/details',async function(req, res, next) {
  var params=req.query;
  var page = params.page || 1;
  var perPage=9;
  var id_products=params.id_products;
  var info_products= await common.api_get(constants.url_server+"/products/info/"+id_products);
  info_products.info.price=common.number_format(info_products.info.price,'vi');
  var list_similar= await common.api_get(constants.url_server+"/products/list_similar?id_category="+info_products.info.categoryid+"&id_product="+id_products+"&limit=10");
  var star_products= await common.api_get(constants.url_server+"/reviews/star_products/"+id_products);
  const arr={info:info_products.info,
             list_price_product:info_products.list_price_product,
             color_image:info_products.color_image,
             condition1:info_products.condition1,
             condition2:info_products.condition2,
             value_condition1:info_products.value_condition1,
             value_condition2:info_products.value_condition2,
             list_similar:list_similar,
             star_products:star_products
            }
  res.render('products/products_details',arr)
});
module.exports = router;
