var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const common=require('../config/common');
const constants=require('../config/constants');
const passport = require('passport');

/* GET users listing. */
router.get('/:order_id',ensureAuthenticated,async function(req, res, next) {
  var info_order=await common.api_get(constants.url_server+"/orders/info/"+req.params.order_id);
  res.render('order/review',{info_order:info_order.info});
});
module.exports = router;
