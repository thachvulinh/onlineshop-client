//common

var url_server= "https://onlineshop-server.herokuapp.com";
$('.money_vi').mask("###,###,###,###", { reverse: true });
var common = {
    init: function () { },
    Check_Input_Number:function(e){
        var value = $(e).val();
            if (isNaN(value)) {
                var thaydoi = value.replace(/[^Z0-9 ]/g, "");
                $(e).val(thaydoi);
            }
    },
    number_format:function(text,lang){
        if(lang=="vi"){
            return new Intl.NumberFormat('vi-VN').format(text);
        }
        else{
            return Intl.NumberFormat('en-US').format(text);;
        }
    }
}
common.init();
