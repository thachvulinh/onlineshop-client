var product = {
    init: function () { 

    },
    update_price:function(data,id_price){
        var color=$("input[name='color']").map(function(){if(this.checked==true){return $(this).val();}}).get();
        var condition1=$("input[name='condition1']").val();
        var value_condition1=$("input[name='value_condition1']").map(function(){if(this.checked==true){return $(this).val();}}).get();
        var condition2=$("input[name='condition2']").val();
        var value_condition2=$("input[name='value_condition2']").map(function(){if(this.checked==true){return $(this).val();}}).get();
        if(JSON.stringify(data)!="[]"){
            $.each(data, function (key, item) {
               if(item["color"]==color[0] && item["condition1"]==condition1 && item["value_condition1"]==value_condition1[0] && item["condition2"]==condition2 && item["value_condition2"]==value_condition2[0]){
                   $(id_price).html(common.number_format(item["price"]),"vi");
                   $("#product_price_id").val(item["_id"]);
               }
            });
        }
    },
    add_cart:function(){
        var price=$("#price_products").val();
        var user_id = $("#user_id").val();
        var product_price_id = $("#product_price_id").val();
        if(user_id!=""){
            if(price==0 && product_price_id==""){
                common.Sweet_Notifi("error","Thông báo", 'Chưa chọn loại sản phẩm',"OK", "#3085d6", "error");
            }
            else{
                var form = document.getElementById("form_products");
                let formData = new FormData(form);
                $.ajax({cache: false,url: url_server+"/cart/save",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                        if (res["result"]==1) {
                            (JSON.stringify(res['data'])!="[]"?$("#cart_number").attr('data-content',res['data'].length):0);
                            common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                        }
                        else {
                            common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                        }
                    },
                    error: function (error) {
                        common.Sweet_Notifi("error", "Thông Báo", "error","OK", "#3085d6", "error");
                    }
                });
            }
        }
        else{
            Swal.fire({title: 'Vui lòng đăng nhập để đặt hàng !', text: "Nhấn vào để đồng ý đăng nhập",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý'}).then((result) => {
                if (result.isConfirmed) {
                    location.href="/login";
                }
            });
        }
        
    },
    buy_product:function(){
        var user_id = $("#user_id").val();
        var price=$("#price_products").val();
        var product_price_id = $("#product_price_id").val();
        if(user_id!=""){
            $.ajax({ url: url_server+'/users/list_address_user/'+user_id,dataType: 'json',type: 'GET',success: function (res) {
                    if(JSON.stringify(res)!="[]"){
                        if(price==0 && product_price_id==""){
                            common.Sweet_Notifi("error","Thông báo", 'Chưa chọn loại sản phẩm',"OK", "#3085d6", "error");
                        }
                        else{
                            $("#form_products").submit();
                        }
                    }
                    else{
                        Swal.fire({title: 'Tài khoản chưa có địa chỉ giao hàng. Vui lòng cập nhật ?', text: "Nhấn vào để đồng ý để truy cập",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý'}).then((result) => {
                            if (result.isConfirmed) {
                                location.href="/users/address";
                            }
                        });
                    }
                }
            })
        }
        else{
            Swal.fire({title: 'Vui lòng đăng nhập trước khi thêm giỏ hàng !', text: "Nhấn vào để đồng ý đăng nhập",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý'}).then((result) => {
                if (result.isConfirmed) {
                    location.href="/login";
                }
            });
        }
    },
    load_list_reviews:function(page){
        var perPage=10;
        var product_id=$("#product_id").val();
        $("#page_review").val(page);
        var product_id=$("#product_id").val(); 
        var user_id=$("#user_id").val();
        var product_user_id=$("#product_user_id").val();
        var user_avatar=$("#user_avatar").val();
        $.ajax({cache: false,url: url_server+"/reviews/list_product_id",type: "POST",data: {product_id:product_id,page:page,perPage:perPage},dataType: "json",success: function (res) {
            var html='';
            if(res.list_reviews_products &&  JSON.stringify(res.list_reviews_products)!="[]"){
                res.list_reviews_products.forEach(function(item,key){
                    html+='<div class="p-2" style="border-bottom:thin dashed #E2E2E2 ;">';
                        if(item.review_products==0){html+='<span style="color:orange;"><i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i></span>';
                        }else if(item.review_products==1){html+='<span style="color:orange;"><i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i></span>';
                        }else if(item.review_products==2){html+='<span style="color:orange;"><i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i></span>';
                        }else if(item.review_products==3){html+='<span style="color:orange;"><i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star-o"></i> <i class="fa fa-lg fa-star-o"></i></span>';
                        }else if(item.review_products==4){html+='<span style="color:orange;"><i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star-o"></i></span>';
                        }else if(item.review_products==5){html+='<span style="color:orange;"><i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i> <i class="fa fa-lg fa-star"></i></span>';} 
                        html+='<h4 class="font-weight-bold"><img src="'+item.users[0].avatar+'" style="width:50px;height:50px;border:thin solid #E2E2E2;border-radius:50%" > ';
                            html+='<span>'+item.users[0].name+'</span> (Khách)<br/>';
                        html+='</h4>';
                        html+='<div class="border p-2 rounded" style="margin-bottom:5px">';
                            html+='<p>'+item.content_products+'</p>';
                            if(item.video_products && JSON.stringify(item.video_products)){
                                item.video_products.forEach(function(item,key){
                                    html+='<div style="float:left;position: relative;padding:0px;cursor: pointer;">';
                                        html+='<video src="'+item+'" class="video_review" style="width:60px;height:60px;margin-right:10px;" onclick="product.view_imag_video(this,\'video\')" ></video>';
                                        html+='<i class="fa fa-play-circle" style="position: absolute;left:25px;top: 20px;font-size: 15px;color: white;"></i>';
                                    html+='</div>';
                                });
                            }
                            if(item.images_products  && JSON.stringify(item.images_products )){
                                item.images_products.forEach(function(item,key){
                                    html+='<div style="float:left;cursor: pointer;">';
                                        html+='<img src="' + item+'" class="img_review" style="width:60px;height:60px;margin-right:10px;" onclick="product.view_imag_video(this,\'img\')"  />';
                                    html+='</div>';
                               });
                            }
                            html+='<div style="clear: both;"></div>';
                        html+='</div>';
                        if(item.reply_reviews_products  &&  JSON.stringify(item.reply_reviews_products )!="[]"){
                            item.reply_reviews_products.forEach(function(item_reply,key_reply){
                                html+='<div style="padding-left:50px;">';
                                    html+='<h4 class="font-weight-bold"><img src="'+item_reply.users[0].avatar+'" style="width:50px;height:50px;border:thin solid #E2E2E2;border-radius:50%" > ';
                                        html+='<span class="text-danger">'+item_reply.users[0].name+'  (Shop)</span>';
                                    html+='</h4>';
                                    html+='<div class="border p-2 rounded">'+item_reply.content_products+'</div>';
                                    html+='<div>';
                                        if(user_id==item_reply.user_id){
                                        html+='<span style="cursor:pointer " onclick="product.delete_review_product(\''+item_reply._id+'\')"> <i class="fa fa-trash-o text-danger"></i></span> ';
                                        }
                                        html+='<span class="text-muted" style="font-size:12px">'+common.Format_DateTime(item_reply.createdAt,"ddmmyyyyhhiiss")+'</span>';
                                    html+='</div>';
                                html+='</div>';
                            });
                        }
                        if(user_id==product_user_id){
                            html+='<div class="input-group">';
                                html+='<div class="input-group-prepend">';
                                    html+='<span class="input-group-text border-0" style="background:none"><img src="'+user_avatar+'" style="width:30px;height:30px;border:thin solid #E2E2E2;border-radius:50%" ></span>';
                                html+='</div>';
                                html+='<input type="text" class="form-control" id="content_products_'+item._id+'" name="content_products_'+item._id+'" placeholder="Nhập câu trả lời">';
                                html+='<div class="input-group-prepend">';
                                    html+='<span class="input-group-text pink_more " style="cursor: pointer;"  onclick="product.insert_review_products(\''+item._id+'\',\''+item.order_id+'\')" >Trả lời</span>';
                                html+='</div>';
                            html+='</div>';
                        }
                    html+='</div>';
                });
            }else{
                html+='<h1 class="text-center">Chưa có đánh giá cho sản phẩm</h1>';
            }
            html+=common.item_pagination(res.pages,res.current,'product.load_list_reviews');
            $("#list_reviews_product").html(html);
        },
        error: function (error) {
            alert("lỗi");
        }});
    },
    insert_review_products:function(id_review,order_id){
        var page_review=$("#page_review").val();
        var product_id=$("#product_id").val(); 
        var user_id=$("#user_id").val();
        var content_products=$("#content_products_"+id_review).val();
        $.ajax({cache: false,url: url_server+"/reviews/insert",type: "POST",data: {order_id:order_id,product_id:product_id,content_products:content_products,user_id:user_id,reply_reviews_product_id:id_review },dataType: "json",success: function (res) {
            if (res["result"]==1) {
                $("#content_products_"+id_review).val('');
                product.load_list_reviews(page_review);
                common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
            }
            else {
                common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
            }
        },
        error: function (error) {
            alert("lỗi");
        }});

    },
    delete_review_product:function(id_review){
        var page_review=$("#page_review").val();
        Swal.fire({title: 'Bạn có muốn xóa không ?', text: "Nhấn vào để đồng ý xóa",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý,Xóa ngay!'}).then((result) => {
            if (result.isConfirmed) {
                $.ajax({ url: url_server+'/reviews/delete/'+id_review,dataType: 'json',type: 'GET',success: function (res) {
                        if (res["result"]==1) {
                            product.load_list_reviews(page_review);
                            common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                        }
                        else {
                            common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                        }
                    },
                    error: function (error) {
                        common.Sweet_Notifi("error", "Xóa Thông Thành Công", "error","OK", "#3085d6", "error");
                    }
                })
            }
        })

    },
    view_imag_video:function(e,type){
        $("#view_img").hide(); $("#view_img").attr("src","");
        $("#view_video").hide(); $("#view_video").attr("src","");
        $("#multip_video_img_review").empty();
        var src=$(e).attr("src");
        var arr_img=new Array();
        var arr_video=new Array();
        var img_review=document.getElementsByClassName('img_review');
        var video_review=document.getElementsByClassName('video_review');
        if(img_review){  $.each(img_review, function (key, item) {arr_img.push(item.src);});}
        if(video_review){$.each(video_review, function (key, item) {arr_video.push(item.src);});}
        if(type=="img"){$("#view_img").show();$("#view_img").attr("src",src);}
        else{$("#view_video").show(); $("#view_video").attr("src",src);}
        var html='';
        if(arr_video && JSON.stringify(arr_video)){
            $.each(arr_video, function (key, item) {
                html+='<label for="video_review_'+item+'" style="float:left;position: relative;cursor: pointer;margin-right:10px; '+(src==item?'border:thin solid red':'')+'">';
                    html+='<video src="'+item+'" class="video_review" style="width:70px;height:70px;" onclick="product.view_imag_video(this,\'video\')" id="video_review_'+item+'" ></video>';
                    html+='<i class="fa fa-play-circle" style="position: absolute;left:25px;top: 25px;font-size: 15px;color: white;"></i>';
                html+='</label>';
            });
        }
        if(arr_img && JSON.stringify(arr_img)){
            $.each(arr_img, function (key, item) {
                html+='<label for="img_review_'+item+'"  style="float:left;cursor: pointer; margin-right:10px; '+(src==item?'border:thin solid red':'')+'">';
                    html+='<img src="'+item+'" class="img_review" style="width:70px;height:70px;" onclick="product.view_imag_video(this,\'img\')" id="img_review_'+item+'"  />';
                html+='</label>';
            });
        }
        $("#multip_video_img_review").html(html);
        $("#modal_view_reviews").modal('show');
    },
    load_list_comment:function(page){
        var perPage=10;
        $("#page_comment").val(page);
        var product_id=$("#product_id").val(); 
        var user_id=$("#user_id").val();
        var product_user_id=$("#product_user_id").val();
        var user_avatar=$("#user_avatar").val();
        $.ajax({cache: false,url: url_server+"/comment_products/list_product_id",type: "POST",data: {product_id:product_id,page:page,perPage:perPage},dataType: "json",success: function (res) {
            var html='';
            if(res.list_comment_products &&  JSON.stringify(res.list_comment_products)!="[]"){
                res.list_comment_products.forEach(function(item,key){
                    html+='<div class="p-2" style="border-bottom:thin dashed #E2E2E2 ;">';
                        html+='<h4 class="font-weight-bold"><img src="'+item.users[0].avatar+'" style="width:50px;height:50px;border:thin solid #E2E2E2;border-radius:50%" > ';
                            html+='<span>'+item.users[0].name+'</span> (Khách)';
                        html+='</h4>';
                        html+='<div class="border p-2 rounded">'+item.content+'</div>';
                        html+='<div>';
                            // if(user_id==item.user_id){
                            // html+='<span onclick="product.delete_comment_product(\''+item._id+'\')"> <i class="fa fa-trash-o text-danger"></i></span>';
                            // }
                            html+='<span class="text-muted" style="font-size:12px">'+common.Format_DateTime(item.createdAt,"ddmmyyyyhhiiss")+'</span>';
                        html+='</div>';
                        if(item.reply_comment_products  &&  JSON.stringify(item.reply_comment_products )!="[]"){
                            item.reply_comment_products.forEach(function(item_reply,key_reply){
                                html+='<div style="padding-left:50px;margin-bottom:5px">';
                                    html+='<h4 class="font-weight-bold"><img src="'+item_reply.users[0].avatar+'" style="width:50px;height:50px;border:thin solid #E2E2E2;border-radius:50%" > ';
                                        html+='<span class="text-danger">'+item_reply.users[0].name+' (Shop)</span>';
                                    html+='</h4>';
                                    html+='<div class="border p-2 rounded">'+item_reply.content+'</div>';
                                    html+='<div>';
                                        if(user_id==item_reply.user_id){
                                        html+='<span style="cursor:pointer " onclick="product.delete_comment_product(\''+item_reply._id+'\')"> <i class="fa fa-trash-o text-danger"></i></span> ';
                                        }
                                        html+='<span class="text-muted" style="font-size:12px">'+common.Format_DateTime(item_reply.createdAt,"ddmmyyyyhhiiss")+'</span>';
                                    html+='</div>';
                                html+='</div>';
                            });
                        }
                        if(user_id==product_user_id){
                            html+='<div class="input-group">';
                                html+='<div class="input-group-prepend">';
                                    html+='<span class="input-group-text border-0" style="background:none"><img src="'+user_avatar+'" style="width:30px;height:30px;border:thin solid #E2E2E2;border-radius:50%" ></span>';
                                html+='</div>';
                                html+='<input type="text" class="form-control" id="comment_products_'+item._id+'" name="comment_products_'+item._id+'" placeholder="Nhập câu trả lời">';
                                html+='<div class="input-group-prepend">';
                                    html+='<span class="input-group-text pink_more " style="cursor: pointer;"  onclick="product.insert_comment_products(\''+item._id+'\')" >Trả lời</span>';
                                html+='</div>';
                            html+='</div>';
                        }
                    html+='</div>';
                });
            }else{
                html+='<h1 class="text-center">Chưa có đánh giá cho sản phẩm</h1>';
            }
            html+=common.item_pagination(res.pages,res.current,'product.load_list_comment');
            $("#list_comment_product").html(html);
        },
        error: function (error) {
            alert("lỗi");
        }});
    },
    insert_comment_products:function(id_comment){
        var page_comment=$("#page_comment").val();
        var product_id=$("#product_id").val(); 
        var user_id=$("#user_id").val();
        var comment_products=$("#comment_products").val();
        var reply_comment_product_id='';
        if(id_comment){
            comment_products=$("#comment_products_"+id_comment).val();
            reply_comment_product_id=id_comment;
        } 
        $.ajax({cache: false,url: url_server+"/comment_products/insert",type: "POST",data: {product_id:product_id,user_id:user_id,content:comment_products,reply_comment_product_id :reply_comment_product_id },dataType: "json",success: function (res) {
            if (res["result"]==1) {
                if(id_comment){
                    $("#comment_products_"+id_comment).val('');
                }
                $("#comment_products").val('');
                product.load_list_comment(page_comment);
                common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
            }
            else {
                common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
            }
        },
        error: function (error) {
            alert("lỗi");
        }});
    },
    delete_comment_product:function(id_comment){
        var page_comment=$("#page_comment").val();
        Swal.fire({title: 'Bạn có muốn xóa không ?', text: "Nhấn vào để đồng ý xóa",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý,Xóa ngay!'}).then((result) => {
            if (result.isConfirmed) {
                $.ajax({ url: url_server+'/comment_products/delete/'+id_comment,dataType: 'json',type: 'GET',success: function (res) {
                        if (res["result"]==1) {
                            product.load_list_comment(page_comment);
                            common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                        }
                        else {
                            common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                        }
                    },
                    error: function (error) {
                        common.Sweet_Notifi("error", "Xóa Thông Thành Công", "error","OK", "#3085d6", "error");
                    }
                })
            }
        })
    }
}
product.init();