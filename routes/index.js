var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
/* GET home page. */
router.get('/',async function(req, res, next) {
  var list_carousels= await common.api_get(constants.url_server+"/carousels/listall");
  var list_newproduct=await common.api_get(constants.url_server+"/products/list_new");
  res.render('index',{list_carousels:list_carousels,list_newproduct:list_newproduct});
});

module.exports = router;
