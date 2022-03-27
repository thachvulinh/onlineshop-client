var express = require('express');
var router = express.Router();
const common=require('../config/common');
const constants=require('../config/constants');
router.get('/list',async function(req, res, next) {
  var params=req.query,keywords=params.keywords || '',
      type_id=params.type_id,sort=params.sort || 0,
      page = params.page || 1,perPage=16,skip=(perPage * page) - perPage;
  var info_type= await common.api_get(constants.url_server+"/posts_types/info/"+type_id);
  var list_posts= await common.api_post(constants.url_server+"/posts/list_posts_type",{type_id:type_id,page:page,perPage:perPage,keywords:keywords,sort});
  res.render('posts/posts_list',{list_posts:(JSON.stringify(list_posts.list)!="[]"?list_posts.list:null),
                              info_type:info_type,
                              current:page,
                              perPage:perPage,
                              pages:Math.ceil((JSON.stringify(list_posts.all_list)!="[]"?list_posts.all_list.length:0) / perPage),
                              total_posts:(JSON.stringify(list_posts.all_list)!="[]"?list_posts.all_list.length:0),
                              skip_posts:(JSON.stringify(list_posts.list)!="[]"?skip:0),
                              keywords:keywords,
                              sort:sort
                            });
});
router.get('/details',async function(req, res, next) {
  var params=req.query;
  var id_posts=params.id_posts;
  var info_posts= await common.api_get(constants.url_server+"/posts/info/"+id_posts);
  var list_similar= await common.api_get(constants.url_server+"/posts/list_similar?type_id="+info_posts.type_id+"&id_posts="+id_posts);
  const arr={info:info_posts,list_similar:list_similar}
  res.render('posts/posts_details',arr);
});
router.get('/',async function(req, res, next) {
  var params=req.query,keywords=params.keywords || '',sort=params.sort || 0
  page = params.page || 1,perPage=16,skip=(perPage * page) - perPage;
  var list_posts= await common.api_post(constants.url_server+"/posts/list_posts_all",{page:page,perPage:perPage,keywords:keywords,sort:sort});
  var list_top_post=await common.api_get(constants.url_server+"/posts/list_top_posts?limit=5");
  var list_new_post=await common.api_get(constants.url_server+"/posts/list_new_posts?limit=5");
  res.render('posts/posts_all',{list_posts:(JSON.stringify(list_posts.list)!="[]"?list_posts.list:null),
                                current:page,
                                perPage:perPage,
                                pages:Math.ceil((JSON.stringify(list_posts.all_list)!="[]"?list_posts.all_list.length:0) / perPage),
                                total_posts:(JSON.stringify(list_posts.all_list)!="[]"?list_posts.all_list.length:0),
                                skip_posts:(JSON.stringify(list_posts.list)!="[]"?skip:0),
                                keywords:keywords,
                                sort:sort,

                                list_top_post:list_top_post,
                                list_new_post:list_new_post
                              });
});
module.exports = router;
