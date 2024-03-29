var order = {
    init: function () {
        order.update_total_price() 
    },
    show_modal_order_cancel:function(){
        $("#model_order_cancel").modal('show');
    },
    check_ok_canncel:function(e){
        if(e.checked){
            $("#btn_ok_cancel_order").attr('disabled',false);
        }
        else{
            $("#btn_ok_cancel_order").attr('disabled',true);
        }

    },
    submit_order_cancel:function(){
        var form = document.getElementById("form_cancel_order");
        let formData = new FormData(form);
        $.ajax({cache: false,url: url_server+"/orders/order_cancel",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                    setTimeout(function(){
                        location.reload();
                    },1000)
                }
                else {
                    common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                }
            },
            error: function (error) {
                alert("lỗi");
            }
        });
    },
    delete:function(){
        $("#row_order").remove();    
    },
    update_total_price:function(){
        var total_temp=0;
        var total=0;
        var total_delivery_price=0;
        var price=$("#price_order").val();
        var quantity=$("#quantity_order").val();
        var delivery_price=$("#delivery_price_one_order").val();
        if(price && quantity && delivery_price){
            total_delivery_price= delivery_price * quantity;
            total_temp=price * quantity
            total= total_temp +  total_delivery_price;
        }
        $("#total_delivery_price").html(common.number_format(total_delivery_price));
        $("#delivery_price").val(total_delivery_price);
        $("#total_price_temp").html(common.number_format(total_temp));
        $("#_total_price_temp").val(total_temp);
        $("#total_price").html(common.number_format(total));
        $("#_total_price").val(total);
    }

}
order.init();