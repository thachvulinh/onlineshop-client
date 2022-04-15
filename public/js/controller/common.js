//common
var host = window.location.hostname;
var url_server="http://localhost:5000";
if(host!="localhost"){
    url_server="https://onlineshop-server.herokuapp.com";
}
// $(document).click(function(e) {
//     // get the clicked element
//     $clicked = $(e.currentTarget);
//     // if the clicked element is not a descendent of the dropdown
   
//     if ($clicked.closest('.dropdown').length === 0) {
//         alert("123");
//       // close the dropdown
//       $('.dropdown').removeClass('open');
//     }
//   });

$('.money_vi').mask("###,###,###,###", { reverse: true });
var common = {
    init: function () { },
    submit_page_list:function(page,id_form){
        $("#page").val(page);
        $(id_form).submit();
    },
    close_form:function(id_form){
        $(id_form).hide();
    },
    Sweet_Notifi:function(icon,title, text,text_btn,color_btn, type){
        Swal.fire({ icon: icon, title: title, html: text,showCancelButton: false,confirmButtonText: text_btn,confirmButtonColor: color_btn, type: type, footer: ''});
    },
    showNotification: function (icon, text, type, timer, from, align) {
        $.notify({icon: icon, message: text}, {type: type,timer: timer, placement: {from: from,align: align}});
    },
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
    },
    check_radio_active:function(e,class_label,id_span){
        $(class_label).css("border","thin solid #DEE2E6");
        $(e).parent().css("border","thin solid #F57224");
        $(id_span).html($(e).val());
    },
    choose_img:function(e,id_img){
        var src=$(e).attr("src");
        $(id_img).attr("src",src);

    },
    select_file_upload: function (e,bg,id_img,id_value) {
        var files = !!e.files ? e.files : [];
        if (!files.length || !window.FileReader) {
            if(bg==1){
                $(id_img).css("background-image", url_server+"/upload/no-image.png");
            }
            else{
                $(id_img).attr('src', url_server+"/upload/no-image.png");
            }
            e.value = "";
        }
        else {
            if (/^image/.test(files[0].type)) {
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onloadend = function () {
                    if(bg==1){
                        $(id_img).css("background-image", "url(" + this.result + ")");
                    }
                    else{
                        $(id_img).attr('src', this.result);
                    }
                    $(id_value).val('');
                    
                }
            }
        }
    },
    check_access_list_cart:function(user_id){
        if(user_id!=""){
            $.ajax({ url: url_server+'/users/list_address_user/'+user_id,dataType: 'json',type: 'GET',success: function (res) {
                    if(JSON.stringify(res)!="[]"){
                        var number_cart=$("#cart_number").attr("data-content");
                        if(number_cart==0){
                            common.Sweet_Notifi("error","Thông báo", 'Không có sản phẩm trong giỏ',"OK", "#3085d6", "error");
                        }
                        else{
                            location.href="/carts/list";
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
            Swal.fire({title: 'Vui lòng đăng nhập để xem giỏ hàng !', text: "Nhấn vào để đồng ý đăng nhập",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý'}).then((result) => {
                if (result.isConfirmed) {
                    location.href="/login";
                }
            });
        }
    },
    Format_DateTime:function(date,type){
        if(type=="ddmmyyyyhhiiss"){
            const d = new Date(date);
            const yyyy = d.getFullYear();
            let mm = d.getMonth() + 1; // Months start at 0!
            let dd = d.getDate();
            let hh = d.getHours();
            let ii = d.getMinutes();
            let ss = d.getSeconds();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            if (hh < 10) hh = '0' + hh;
            if (ii < 10) ii = '0' + ii;
            if (ss < 10) ss = '0' + ss;
            const today = dd + '/' + mm + '/' + yyyy +' '+hh+':'+ii+':'+ss ;
            return today;
        }
    },
    item_pagination:function(pages,current,fuc){
        var html='';
        html+='<div class="product_pagination" style="border-top:none">';
            if(pages > 0) { 
                html+='<div class="left_btn"><a href="javascript:void(0)" onclick="'+fuc+'(\''+(Number(current) - 1)+'\')" class="'+(current==1?'disabled-link':'')+'"><i class="lnr lnr-arrow-left"></i> Quay lại </a></div>';
                html+='<div class="middle_list">';
                    html+='<nav aria-label="Page navigation example">';
                        html+='<ul class="pagination">';
                            var i = (Number(current) > 3 ? Number(current) - 2 : 1);
                            if(i !== 1) {
                            html+='<li class="page-item disabled"><a class="page-link" href="javascript:void(0)">...</a></li>';
                            }
                            for(; i <= (Number(current) + 2) && i <= pages; i++) {
                                html+='<li class="page-item  '+(i == current?'active':'')+'"><a href="javascript:void(0)" class="page-link" onclick="'+fuc+'(\''+i+'\')" >'+i+'</a></li>';
                                if (i == Number(current) + 2 && i < pages) { 
                                html+='<li class="page-item disabled"><a class="page-link" href="javascript:void(0)">...</a></li>';
                                }
                            }
                        html+='</ul>';
                    html+='</nav>';
                html+='</div>';
                html+='<div class="right_btn"><a href="javascript:void(0)" onclick="'+fuc+'(\''+(Number(current) + 1)+'\')" class="'+ (current == pages?'disabled-link':'')+'"> Tiếp <i class="lnr lnr-arrow-right"></i></a></div>';
            }
        html+='</div>';
        return html;
    },
    

}
common.init();
