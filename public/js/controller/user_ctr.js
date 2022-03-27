var users = {
    init: function () {
        users.loadprovince("#province_city",'');
    },
    loadprovince:function(id_select,select){
        $.ajax({
            url: url_server+'/users/loadprovince',
            type: "GET",
            dataType: "json",
            success: function (response) {
                var html = '<option value="">--Chọn tỉnh thành--</option>';
                $.each(response, function (i, item) {
                    var  provice=item._attributes;
                    html += '<option '+(parseInt(provice.id)==select?'selected':'')+' value="' + provice.id + '">' + provice.value + '</option>'
                });
                $(id_select).html(html);
            }
        })
    },
    loaddistrict:function(id_select,select,id_provice,id_wards){
        $(id_wards).html("");
        $(id_select).html("");
        var value_privice=$(id_provice).val();
        $.ajax({
            url: url_server+'/users/loaddistrict/'+value_privice,
            type: "GET",
            dataType: "json",
            success: function (response) {
                var html = '<option value="">--Chọn quận huyện--</option>';
                $.each(response, function (i, item) {
                    var  district=item._attributes;
                    html += '<option '+(select==district.id?'selected':'')+' value="' + district.id + '">' + district.value + '</option>'
                });
                $(id_select).html(html);
            }
        })
    },
    loadwards:function(id_select,select,id_provice,id_district){
        var value_privice=$(id_provice).val();
        var value_district=$(id_district).val();
        $.ajax({
            url: url_server+'/users/loadwards/'+value_privice+'/'+value_district,
            type: "GET",
            dataType: "json",
            success: function (response) {
                var html = '<option value="">--Chọn xã phường--</option>';
                $.each(response, function (i, item) {
                    var  wards=item._attributes;
                    html += '<option '+(select==wards.id?'selected':'')+' value="' + wards.id + '">' + wards.value + '</option>'
                });
                $(id_select).html(html);
            }
        })
    },
    update_address:function(){
        var e_province_city = document.getElementById("province_city");
        var e_district = document.getElementById("district");
        var e_wards = document.getElementById("wards");
        if(e_province_city.options[e_province_city.selectedIndex]){
            $("#value_province_city").val(e_province_city.options[e_province_city.selectedIndex].text);
        }
        if(e_district.options[e_district.selectedIndex]){
            $("#value_district").val(e_district.options[e_district.selectedIndex].text);
        }
        if(e_wards.options[e_wards.selectedIndex]){
            $("#value_wards").val(e_wards.options[e_wards.selectedIndex].text);
        }
    },
    save_address:function(){
        var form = document.getElementById("form_users_address");
        let formData = new FormData(form);
        $.ajax({cache: false,url: url_server+"/users/save_address",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    $("#row_emty").remove();
                   
                    var html='';
                        html+='<td class="text-center">';
                            html+='<a href="#top_form_users_address" class="btn btn-info btn-sm mb-1" onclick="users.info_user_address_form(\''+res["row"]["_id"]+'\')" ><i class="fa fa-pencil"></i></a> <br/>';
                            html+='<button class="btn btn-danger btn-sm" onclick="users.delete_user_address_form(\''+res["row"]["_id"]+'\')"><i class="fa fa-trash-o"></i></button>';
                        html+='</td>';
                        html+='<td>'+res["row"]["name"]+'<br/>'+res["row"]["phone"]+'</td>';
                        html+='<td> <span class="d-inline bg-danger text-white rounded p-1">'+(res["row"]["type"]=="home"?"Nhà riêng":"Văn phòng")+'</span><br/>'+res["row"]["address"]+'<br/> <b>Postcode:</b> '+res["row"]["value_province_city"]+' - '+res["row"]["value_district"]+' - '+res["row"]["value_wards"]+'</td>';
                        html+='<td>';
                            html+='<label>';
                                html+='<input type="radio" name="use_shippting" '+(res["row"]["use_shippting"]==1?'checked':'')+'  onchange="users.update_address_use_shipping_billing(this,\''+res["row"]["user_id"]+'\',\'shopping\')" value="'+res["row"]["_id"]+'" /> Giao hàng<br/>';
                            html+='<label>';
                            html+='<label>';
                                html+='<input type="radio" name="use_billing" '+(res["row"]["use_billing"]==1?'checked':'')+' onchange="users.update_address_use_shipping_billing(this,\''+res["row"]["user_id"]+'\',\'billing\')" value="'+res["row"]["_id"]+'" /> Thanh toán';
                            html+='<label>';
                        html+='</td>';
                    if(res["type"]=="edit"){
                        $("#row_"+res["row"]["_id"]).html(html);
                    }
                    else{
                        var html2='';
                        html2+='<tr id="row_'+res["row"]["_id"]+'">';
                            html2+=html;
                        html2+='</tr>';
                        $("#table_users_address").prepend(html2);
                    }
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                    $("#f_users_address").hide();
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
    info_user_address_form: function (id) {
        $("#f_users_address").show();
        if(id!=""){
            $.ajax({ url: url_server+'/users/info_address/'+id,dataType: 'json',type: 'GET',success: function (res) {
                $("#id").val(res["_id"]);
                $("#value_province_city").val(res["value_province_city"]);
                $("#value_district").val(res["value_district"]);
                $("#value_wards").val(res["value_wards"]);
                $("#name").val(res["name"]);
                $("#phone").val(res["phone"]);
                $("#address").val(res["address"]);
                users.loadprovince("#province_city",res["province_city"]);
                setTimeout(function(){
                    users.loaddistrict('#district',res["district"],'#province_city','#wards');
                },1000);
                setTimeout(function(){
                    users.loadwards('#wards',res["wards"],'#province_city','#district');
                },2000);
                (res["type"]=="home"?$("#home").prop("checked",true):$("#works").prop("checked",true));
                }
            })
        }
        else{
            $("#id").val("");
            $("#value_province_city").val("");
            $("#value_district").val("");
            $("#value_wards").val("");
            $("#name").val("");
            $("#phone").val("");
            $("#address").val("");
            users.loadprovince("#province_city",'');
            $("#district").empty();
            $("#wards").empty();
            $("#type").val("home");
        }
    },
    delete_user_address_form:function(id){
        Swal.fire({title: 'Bạn có muốn xóa không ?', text: "Nhấn vào để đồng ý xóa",icon: 'warning',showCancelButton: true,cancelButtonText: 'Hủy',confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',confirmButtonText: 'Đồng ý,Xóa ngay!'}).then((result) => {
            if (result.isConfirmed) {
                $.ajax({ url: url_server+'/users/delete_address/'+id,dataType: 'json',type: 'GET',success: function (res) {
                        if (res["result"]==1) {
                            $("#row_"+id).remove();
                            common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                        }
                        else {
                            common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                        }
                    },
                    error: function (error) {
                        common.Sweet_Notifi("error", "Xóa Không Thành Công", "error","OK", "#3085d6", "error");
                    }
                })
            }
          })
    },
    update_address_use_shipping_billing:function(e,user_id,use_type){
        var id=$(e).val();
        $.ajax({ url: url_server+'/users/update_address_use_shipping_billing',data:{id:id,user_id:user_id,use_type:use_type},dataType: 'json',type: 'GET',success: function (res) {
                if (res["result"]==1) {
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                }
                else {
                    common.Sweet_Notifi("error", res["message"], '',"OK", "#3085d6", "error");
                }
            },
            error: function (error) {
                common.Sweet_Notifi("error", "Xóa Không Thành Công", "error","OK", "#3085d6", "error");
            }
        })
    },
    update_user:function(){
        var form = document.getElementById("form_users");
        let formData = new FormData(form);
        $.ajax({cache: false,url: url_server+"/users/update",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    setTimeout(() => {
                        users.update_session_user();
                    }, 2000);
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
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
    update_password:function(){
        var form = document.getElementById("form_users_update_password");
        let formData = new FormData(form);
        $.ajax({cache: false,url: url_server+"/users/update_password",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    setTimeout(() => {
                        users.update_session_user();
                    }, 2000);
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
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
    update_session_user:function(){
        $.ajax({ url:'/users/update_session_user',dataType: 'json',type: 'GET',success: function (res) {
            location.reload();
        },
        error: function (error) {
            common.Sweet_Notifi("error", "Đã gặp sự cố", "error","OK", "#3085d6", "error");
        }
    })
    }
}
users.init();