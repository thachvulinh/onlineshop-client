var cart = {
    init: function () {
        cart.update_total_price() 
    },
    delete:function(id){
        Swal.fire({title: 'Bạn có muốn xóa không ?', text: "Nhấn vào để đồng ý xóa",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý, Xóa ngay!'}).then((result) => {
            if (result.isConfirmed) {
                $.ajax({ url: url_server+'/cart/delete/'+id,dataType: 'json',type: 'GET',success: function (res) {
                        if (res["result"]==1) {
                            $("#row_"+id).remove();
                            var check_row_cart=$("tr").hasClass("row_cart");
                            if(check_row_cart==false){
                                var html='';
                                html+='<tr>';
                                    html+='<td colspan="4" class="text-center">Không có sản phẩm</td>';
                                html+='</tr>';
                                $("#table_cart").append(html);
                                $("#cart_submit").hide();
                            }
                            cart.update_total_price()
                            common.Sweet_Notifi("success",'Thông báo' , res["message"],"OK", "#3085d6", "success");
                        }
                        else {
                            common.Sweet_Notifi("error",'Thông báo',res["message"],"OK", "#3085d6", "error");
                        }
                    },
                    error: function (error) {
                        common.Sweet_Notifi("error", "Thông báo", "Đã xảy ra lỗi","OK", "#3085d6", "error");
                    }
                })
            }
        })
           
    },
    delete_multip:function(){
        Swal.fire({title: 'Bạn có muốn xóa không ?', text: "Nhấn vào để đồng ý xóa",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý, Xóa ngay!'}).then((result) => {
            if (result.isConfirmed) {
                var list_id=$("input[name='check_cart[]']").map(function(){if(this.checked==true){return $(this).val();}}).get();
                if(JSON.stringify(list_id)!="[]" ){
                    $.ajax({type: 'POST', url: url_server+'/cart/delete_multip',data:{list_id:list_id},dataType: 'json',success: function (res) {
                            if (res["result"]==1) {
                                $.each (list_id,function (key, item){
                                    $("#row_"+item).remove();
                                });
                                var check_row_cart=$("tr").hasClass("row_cart");
                                if(check_row_cart==false){
                                    var html='';
                                    html+='<tr>';
                                        html+='<td colspan="4" class="text-center">Không có sản phẩm</td>';
                                    html+='</tr>';
                                    $("#table_cart").append(html);
                                    $("#cart_submit").hide();
                                }
                                cart.update_total_price();
                                common.Sweet_Notifi("success",'Thông báo',res["message"],"OK", "#3085d6", "success");
                            }
                            else {
                                common.Sweet_Notifi("error",'Thông báo', res["message"],"OK", "#3085d6", "error");
                            }
                        },
                        error: function (error) {
                            common.Sweet_Notifi("error", "Thông Báo", "Đã xảy ra lỗi","OK", "#3085d6", "error");
                        }
                    })
                }
                else{
                    common.Sweet_Notifi("error", "Thông Báo", "Chưa chọn sản phẩm","OK", "#3085d6", "error");
                }
            }
        })
    },
    update_check_cart:function(e){
        var id=$(e).val();
        $.ajax({cache: false,url: url_server+"/cart/update_check_cart",type: "POST",data: {id:id},dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    //common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                }
                else {
                    ///common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                }
            },
            error: function (error) {
                alert("lỗi");
            }
        });
    },
    update_quantity_cart:function(e,id){
        var quantity=$(e).val();
        $.ajax({cache: false,url: url_server+"/cart/update_quantity_cart",type: "POST",data: {id:id,quantity:quantity},dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    //common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                }
                else {
                    //common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                }
            },
            error: function (error) {
                alert("lỗi");
            }
        });
    },
    update_total_price:function(){
        var list_id=$("input[name='check_cart[]']").map(function(){if(this.checked==true){return $(this).val();}}).get();
        var total=0;
        var total_temp=0;
        var total_delivery_prices=0;
        if(JSON.stringify(list_id)!="[]" ){
            $.each (list_id,function (key, item){
                var id=item;
                var price=$("#price_"+id).val();
                var ship_one_order=$("#ship_one_order_"+id).val();
                var quantity=$("#quantity_"+id).val();
                total_delivery_prices+=ship_one_order * quantity;
                total_temp+=price * quantity;

                $("#ship_"+id).val(ship_one_order * quantity);
                $("#span_ship_"+id).html(common.number_format(ship_one_order * quantity));
            });
            total=total_temp + total_delivery_prices;
        }
        $("#total_delivery_prices").html(common.number_format(total_delivery_prices));
        $("#_total_delivery_prices").val(total_delivery_prices);
        $("#total_price_temp").html(common.number_format(total_temp));
        $("#_total_price_temp").val(total_temp);
        $("#total_price").html(common.number_format(total));
        $("#_total_price").val(total);
    },
    check_order_submit:function(){
        var list_id=$("input[name='check_cart[]']").map(function(){if(this.checked==true){return $(this).val();}}).get();
        if(JSON.stringify(list_id)!="[]"){
            $("#form_cart").submit();
        }
        else
        {
            common.Sweet_Notifi("error", "Thông Báo", "Chưa chọn sản phẩm đặt hàng","OK", "#3085d6", "error");
        }
    }   


}
cart.init();