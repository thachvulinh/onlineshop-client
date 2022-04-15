const  object_ListImage=new DataTransfer();
var arr_list_img=new Array();
const  object_ListVideo=new DataTransfer();
var arr_list_video=new Array();
var review = {
    init: function () {},
    //image
    Remove_Image:function(id_list_img,order){
        $(".image-preview-"+order).remove();
        object_ListImage.items.remove(order);
        review.Show_DatDataTransfer_Image(id_list_img);
    },
    ItemImage:function(id_list_img,url,_order){
        var html='';
        html +='<label class="items_img image-preview image-preview-'+_order+'" style="height:75px;width:75px;float: left;margin-left:5px; border: thin solid #e5e5e5;position: relative;">';
            html +='<span onclick="review.Remove_Image(\''+id_list_img+'\',\''+_order+'\')"  style="position:absolute; right:5px;cursor: pointer; "><i class="fa fa-times text-danger"></i></span>';
            html +='<img src="'+url+'" alt="..." id="img_insert_"'+_order+' style="width:100%;height:100%" />';
        html +='</label>';
        $(id_list_img).append(html);
    },
    Show_DatDataTransfer_Image:function(id_list_img){
        $('.image-preview').remove();
        var file,reader,order=0,i=0;
        for(i=0;i<object_ListImage.files.length;i++){
            review.ItemImage(id_list_img,url_server+"/upload/no-image.png",i);
            file = object_ListImage.files[i];
            reader = new FileReader();
            reader.onload = function(file) {
                var address=file.target.result;
                $('.image-preview-'+order+' img').attr('src',address);
                arr_list_img.push(address);
                order++; 
            };
            reader.readAsDataURL(file);
        }
    },
    select_files_image_upload:function(e,id_list_img){
        var fileInput = e ,filePath = fileInput.value,allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if(!allowedExtensions.exec(filePath)){
            common.Sweet_Notifi("error", "Thông báo", 'Vui lòng upload các file có định dạng hình ảnh: .jpeg/.jpg/.png/.gif.',"OK", "#3085d6", "error");
            fileInput.value = '';
            return false;
        }
        else{
                var files = fileInput.files;
                for (var i = 0; i < files.length; i++) {
                    var image_new=object_ListImage.files.length;
                    var number_img=image_new;
                    if(number_img==7) {
                        common.Sweet_Notifi("error", "Thông báo", 'Số lượng tối đa chỉ 7 hình',"OK", "#3085d6", "error");
                        return;
                    }
                    object_ListImage.items.add(files[i]);
                }
                review.Show_DatDataTransfer_Image(id_list_img);
                e.files=object_ListImage.files;
        }
    },
    //video
    Remove_Video:function(id_list_video,order){
        $(".video-preview-"+order).remove();
        object_ListVideo.items.remove(order);
        review.Show_DatDataTransfer_Video(id_list_video);
    },
    ItemVideo:function(id_list_video,url,_order){
        var html='';
        html +='<div class="items_video video-preview video-preview-'+_order+'" style="height:120px;width:120px;float: left;margin-left:5px;margin-bottom:20px; border: thin solid #e5e5e5;position: relative;">';
            html +='<span onclick="review.Remove_Video(\''+id_list_video+'\',\''+_order+'\')"  style="cursor: pointer; float:right;margin-right:5px;"><i class="fa fa-times text-danger"></i></span>';
            html +='<video src="'+url+'" alt="..." id="video_insert_"'+_order+' style="width:100%;height:90px" controls ></video>';
        html +='</div>';
        $(id_list_video).append(html);
    },
    Show_DatDataTransfer_Video:function(id_list_video){
        $('.video-preview').remove();
        var file,reader,order=0,i=0;
        for(i=0;i<object_ListVideo.files.length;i++){
            review.ItemVideo(id_list_video,url_server+"/upload/no-image.png",i);
            file = object_ListVideo.files[i];
            reader = new FileReader();
            reader.onload = function(file) {
                var address=file.target.result;
                $('.video-preview-'+order+' video').attr('src',address);
                arr_list_video.push(address);
                order++; 
            };
            reader.readAsDataURL(file);
        }
    },
    select_files_video_upload:function(e,id_list_img){
        var fileInput = e ,filePath = fileInput.value,allowedExtensions = /(\.mp4|\.mpeg|\.mkv)$/i;
        if(!allowedExtensions.exec(filePath)){
            common.Sweet_Notifi("error", "Thông báo", 'Vui lòng upload các file có định dạng hình ảnh: .mp4/.mpeg/.mkv',"OK", "#3085d6", "error");
            fileInput.value = '';
            return false;
        }
        else{
                var files = fileInput.files;
                for (var i = 0; i < files.length; i++) {
                    var video_new=object_ListVideo.files.length;
                    var number_img=video_new;
                    if(number_img==3) {
                        common.Sweet_Notifi("error", "Thông báo", 'Số lượng tối đa chỉ 3 video',"OK", "#3085d6", "error");
                        return;
                    }
                    object_ListVideo.items.add(files[i]);
                }
                review.Show_DatDataTransfer_Video(id_list_img);
                e.files=object_ListVideo.files;
        }
    },
    insert:function(){
        var form = document.getElementById("form_review");
        let formData = new FormData(form);
        $.ajax({cache: false,url: url_server+"/reviews/insert",type: "POST",data: formData,contentType: false,processData: false,dataType: "json",success: function (res) {
                if (res["result"]==1) {
                    form.reset();
                    common.Sweet_Notifi("success", res["message"], '',"OK", "#3085d6", "success");
                    setTimeout(function(){
                        location.href="/orders/list?status=3";
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
   

}