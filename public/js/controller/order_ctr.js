var order = {
    init: function () {
        order.update_total_price() 
    },
    delete:function(){
        $("#row_order").remove();    
    },
    update_total_price:function(){
        var total=0;
        var price=$("#price_order").val();
        var quantity=$("#quantity_order").val();
        if(price && quantity){
            total=price * quantity;
        }
        $("#total_price_temp").html(common.number_format(total));
        $("#_total_price_temp").val(total);
        $("#total_price").html(common.number_format(total));
        $("#_total_price").val(total);
    }

}
order.init();