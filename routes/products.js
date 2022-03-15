var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');


/* GET home page. */
router.get('/list',async function(req, res, next) {
  var params=req.query;
  var keywords=params.keywords;
  var min=params.min || 0;
  var max=params.max || 50000000;
  var sort=params.sort || 0;
  var id_category=params.id_category;
  var similar_category_list=new Array();
  var list_products=new Array();
  var info_category=new Array();
  var page = params.page || 1;
  var perPage=16;
  var skip=(perPage * page) - perPage;
  if(id_category){
    info_category= await common.api_get(constants.url_server+"/categorys/info/"+id_category);
    similar_category_list=await common.api_get(constants.url_server+"/categorys/list_Parent/"+info_category.parentID);
  }
  list_products= await common.api_post(constants.url_server+"/products/list_products",{id_category:id_category,min:params.min,max:params.max,sort:sort,page:page,perPage:perPage,keywords:keywords});
  res.render('products/products_list',{id_category:id_category,
                              list_products:(JSON.stringify(list_products)?list_products.list:null),
                              similar_category_list:similar_category_list,
                              info_category:info_category,
                              min:min,
                              max:max,
                              sort:sort,
                              current:page,
                              perPage:perPage,
                              pages:Math.ceil((JSON.stringify(list_products)!="[]"?list_products.all_list.length:0) / perPage),
                              total_products:(JSON.stringify(list_products)!="[]"?list_products.all_list.length:0),
                              skip_product:skip,
                              keywords:keywords
                            });
});
router.get('/details',async function(req, res, next) {
  var params=req.query;
  var id_products=params.id_products;
  var info_products= await common.api_get(constants.url_server+"/products/info/"+id_products);
  console.log(info_products);
  res.render('products/products_details',info_products)
});
module.exports = router;
