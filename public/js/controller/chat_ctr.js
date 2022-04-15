//window.scrollTo(0, document.body.scrollHeight);
var user_id = $('#user_id').val();
var name_user=$('#name_user').val();
var avatar_user=$('#avatar_user').val();
var rank_id_user=$('#rank_id_user').val();
var elem = document.getElementById('chat_content');
var num_user=0;
var num_user_send=0;
const socket = io(url_server,{withCredentials: true,forceNew: true,reconnectionAttempts: "Infinity", timeout: 10000,transports: ['websocket']});
var chat = {
    init: function () {},
    load_list_shop(list_user_id_online){
        if(rank_id_user=="623c3926b16fd877d2f87f71"){
            $.ajax({ url: url_server+'/users/list_shop?user_id='+user_id,dataType: 'json',type: 'GET',success: function (res) { 
                chat.list_shop(res,list_user_id_online);
            }});
        }
        else{
            $.ajax({ url: url_server+'/users/list_customer?user_id='+user_id,dataType: 'json',type: 'GET',success: function (res) { 
                chat.list_shop(res,list_user_id_online);
            }});
        }
    },
    open_chat:function(){
        document.getElementById("myForm").style.display = "block";
    },
    close_chat:function(){
        document.getElementById("myForm").style.display = "none";
    },
    update_message_view:function(user_id,send_user_id){
        $.ajax({ url: url_server+'/chats/update_message_view',data:{user_id:user_id,send_user_id:send_user_id},dataType: 'json',type: 'POST',success: function (res) {
            $("#number_chat_"+send_user_id).html("") 
        }});
    },
    list_shop:function(list_shop,list_user_id_online){
        var send_user_id= $("#send_user_id").val();
        $(".online_chat").empty();
        var html='';
        html+='<ul>';
        if(list_shop && JSON.stringify(list_shop)!="[]"){
            list_shop.forEach(function(item,key){
                var list=new Array();
                if(JSON.stringify(list_user_id_online)!="[]"){
                    list=list_user_id_online.find(x=> x.user_id==item._id);
                }
                var id_socket=(list?list.id:'');
                html+='<li class="item_shop '+(send_user_id==item._id?'active':'')+'" onclick="chat.view_chat_shop(this,\''+item._id+'\',\''+item.name+'\',\''+id_socket+'\')">';
                    html+='<div id="number_chat_'+item._id+'">';
                    if(item.list_number_message.length!=0){
                        html+='<div class="number_chat" >'+ (item.list_number_message.length > 5?'5<sup>+</sup>':item.list_number_message.length)+'</div>';
                    }
                    html+='</div>';
                    html+='<img src="'+item.avatar+'"  />';
                    if(list){
                        html+='<span class="online_chat"><i class="fa fa-circle"></i></span>';
                    }
                html+='</li>';
            });
        }
        html+='</ul>';
        $("#list_shop_chat").html(html);  
    },
    view_chat_shop:function(e,send_user_id,name_shop,id_socket_send){
        $("#chat_content").empty();
        $(".item_shop").removeClass('active');
        $("#name_shop").html(name_shop);
        $(e).addClass('active');
        $("#form_chat").show();
        $("#send_user_id").val(send_user_id);
        $("#id_socket_send").val(id_socket_send);
        chat.update_message_view(user_id,send_user_id);
        $.ajax({ url: url_server+'/chats/list_chat_user_id',data:{user_id:user_id,send_user_id:send_user_id},dataType: 'json',type: 'POST',success: function (res) {
            if(JSON.stringify(res)!="[]"){
                num_user=0;
                num_user_send=0;
                res.forEach(function(item,key){
                    if(item.user_id==user_id){
                        if(num_user==0){chat.items_message(true,'right',item._id,item.users[0]._id,item.users[0].name,item.users[0].avatar,item.content,item.recall);}
                        else{chat.items_message(false,'right',item._id,item.users[0]._id,item.users[0].name,item.users[0].avatar,item.content,item.recall); }
                        num_user++;num_user_send=0;
                    }
                    else{
                        if(num_user_send==0){chat.items_message(true,'left',item._id,item.users[0]._id,item.users[0].name,item.users[0].avatar,item.content,item.recall);}
                        else{chat.items_message(false,'left',item._id,item.users[0]._id,item.users[0].name,item.users[0].avatar,item.content,item.recall);}
                        num_user=0;num_user_send++;
                    }
                });
            }
            window.setTimeout(function() {elem.scrollTop = elem.scrollHeight;}, 1000);
        }});
        
    },
    items_message:function(bool_img,type,id_chat,user_id,user_name,user_img,content,recall){
        var send_user_id = $('#send_user_id').val();
        var oncontextmenu=(recall==1?'':'oncontextmenu="chat.show_context_menu(event,\''+id_chat+'\',\''+user_id+'\')"');
        var html='';
            html+='<div class="items_message_'+send_user_id+' '+(type=='right'?'message_info_right':'message_info_left')+'">';
                if(bool_img==true){html+='<img src="'+user_img+'" >';}
                html+='<div class="message_content" style="';
                    if(type=='right' && bool_img==false ){html+='margin-top: -15px;margin-right: 49px';}
                    else if(type=='left' && bool_img==false){html+='margin-top: -15px;margin-left: 49px';}
                    html+='" '+oncontextmenu+' id="message_'+id_chat+'">';
                    html+=(recall==1?'Tin nhắn đã thu hồi':content);
                html+='</div>';
            html+='</div>';
        $("#chat_content").append(html);
    },
    hide_context_menu:function(){
        document.getElementById("contextMenu").style.display = "none";
    },
    show_context_menu:function(e,id_chat,user_id_context){
        $("#recall").hide();
        if(user_id_context==user_id){
            $("#recall").show();
        }
        $("#id_chat").val(id_chat);
        e.preventDefault();
        if (document.getElementById( "contextMenu").style.display == "block"){chat.hide_context_menu();}
        var menu = document.getElementById("contextMenu")  
            menu.style.display = 'block';
            menu.style.left = (e.pageX - 100) + "px" ;
            menu.style.top = e.pageY + "px";
    },
    recall:function(){
        var id=$("#id_chat").val();
        var id_socket_send = $('#id_socket_send').val();
        $.ajax({ type: 'GET',url: url_server+'/chats/recall/'+id,dataType: 'json',success: function (res) {
            if(res.result==1){
                socket.emit("recall_chat",{id_socket_send:id_socket_send,id_chat:id});
            }
            else{
                common.Sweet_Notifi("error","Thông báo", 'Đã xảy ra lỗi',"OK", "#3085d6", "error");
            }
        },
        error: function (error) {
            alert("lỗi");
        }});
    },
    CopyToClipboard:function(){
        var id=$("#id_chat").val();
        var containerid="message_"+id;
        var r = document.createRange();
        r.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
}
chat.init();
document.onclick = chat.hide_context_menu
socket.emit("client_send_user_id",user_id);
socket.on("recall_chat",function(data){
   $("#message_"+data.id_chat).html('Tin nhắn đã thu hồi');
});
socket.on("server_send_list_user_id",function(data){
    chat.load_list_shop(data);
});
socket.on("focusin_message",function(data){
    var send_user_id = $('#send_user_id').val();
    if(send_user_id==data.user_id){
        $("#focus_message").html(data.message);
    }
});
socket.on("focusout_message",function(data){
    var send_user_id = $('#send_user_id').val();
    if(send_user_id==data.user_id){
        $("#focus_message").html('');
    }
});
$("#message").focusin(function(){
    var id_socket_send = $('#id_socket_send').val();
    socket.emit("focusin_message",{id_socket_send:id_socket_send,user_id:user_id,message:name_user+" đang nhắn tin"});
})
$("#message").focusout(function(){
    var id_socket_send = $('#id_socket_send').val();
    socket.emit("focusout_message",{id_socket_send:id_socket_send,user_id:user_id});
})
socket.on("send", function (data) {
    // $("#number_chat_"+data.server.user_id).html('');
    // if(data.server.list_message_new.length!=0){
    //     $("#number_chat_"+data.server.user_id).html('<div class="number_chat" >'+(data.server.list_message_new.length > 5?'5<sup>+</sup>':data.server.list_message_new.length)+'</div>');
    // }
    if(document.getElementsByClassName('items_message_'+data.server.send_user_id).length==0){
        num_user=0;num_user_send=0;
    }
    if(data.server.user_id==user_id){
        if(num_user==0){chat.items_message(true,'right',data.server.row_new._id,data.server.user_id,data.server.name_user,data.server.avatar_user,data.server.message,data.server.row_new.recall);}
        else{chat.items_message(false,'right',data.server.row_new._id,data.server.user_id,data.server.name_user,data.server.avatar_user,data.server.message,data.server.row_new.recall);}
        num_user++;num_user_send=0
    }
    else{
        chat.load_list_shop(data.UserOnline);
        var send_user_id = $('#send_user_id').val();
        if(send_user_id==data.server.user_id){
            if(num_user_send==0){chat.items_message(true,'left',data.server.row_new._id,data.server.user_id,data.server.name_user,data.server.avatar_user,data.server.message,data.server.row_new.recall);}
            else{chat.items_message(false,'left',data.server.row_new._id,data.server.user_id,data.server.name_user,data.server.avatar_user,data.server.message,data.server.row_new.recall);}
            num_user=0;num_user_send++;
            chat.update_message_view(data.server.send_user_id,data.server.user_id);
        }
    }
})
$("#sendMessage").on('click', function () {
    var id_socket_send = $('#id_socket_send').val();
    var send_user_id = $('#send_user_id').val();
    var message = $('#message').val();
    if (message == '') {
        common.Sweet_Notifi("error", "Thông báo", 'Vui lòng nhập tin nhắn',"OK", "#3085d6", "error");
    } else {
        $.ajax({ url: url_server+'/chats/insert',data:{user_id:user_id,send_user_id:send_user_id,content:message},dataType: 'json',type: 'POST',success: function (res) {
            socket.emit('send', {user_id:user_id,send_user_id:send_user_id,message:message,name_user:name_user,avatar_user:avatar_user,row_new:res.row_new,list_message_new:res.data,id_socket_send:id_socket_send});
            window.setTimeout(function() {elem.scrollTop = elem.scrollHeight;}, 1000);
        }});
        $('#message').val('');
    }
})
