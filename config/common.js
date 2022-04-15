const axios = require('axios')
exports.api_get =async function(url){
    return await axios.get(url).then(res => { return res.data}).catch(error => {console.error(error)});
}
exports.api_post =async function(url,data){
    return await axios.post(url,data).then(res => { return res.data}).catch(error => {console.error(error)});
}
exports.http_local = function(request){
    return request.protocol + '://' + request.get('host');
}
exports.number_format = function(text,lang){
    if(lang=="vi"){
        return new Intl.NumberFormat('vi-VN').format(text);
    }
    else{
        return Intl.NumberFormat('en-US').format(text);;
    }
}
exports.shorten_characters = function(text,number,replace){
    if(text){text=text}else{text=""}
    var characters=text;
    var number_characters=text.length;
    if(number_characters>number){
        characters=text.substring(0,number)+replace;
    }
    return characters;
}
exports.format_date = function(date,type){
    var result='';
    if(date!="")
    {
        var d = new Date(date);
        var date_yyyymmdd = d.getFullYear() + '/' +
                ((d.getMonth()+1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) +
                '/' +(d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
        var date_ddmmyyyy =(d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + '/' +
                ((d.getMonth()+1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) +
                '/' + d.getFullYear();
        var date_yyyymmdd_2 = d.getFullYear()  +
                ((d.getMonth()+1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) +(d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
        var time= (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +
                ':' +
                (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
                ':' +
                (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
        var time_2= (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + 
                (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
                (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
        if(type==1){
            result= date_yyyymmdd+' '+time;
        }
        else if(type==2){
            result= date_ddmmyyyy+' '+time;
        }
        else if(type==3){
            result= date_yyyymmdd;
        }
        else if(type==4){
            result= date_ddmmyyyy;
        }
        else if(type==5){
            result= date_yyyymmdd_2+time_2;
        }
        else if(type==6){
            result= time_2;
        }
    }
    return result;
}