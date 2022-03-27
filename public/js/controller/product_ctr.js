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
        if(user_id!=""){
            $.ajax({ url: url_server+'/users/list_address_user/'+user_id,dataType: 'json',type: 'GET',success: function (res) {
                    if(JSON.stringify(res)!="[]"){
                        $("#form_products").submit();
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
    }
}
product.init();