const axios = require('axios')
exports.api_get =async function(url){
    return await axios.get(url).then(res => { return res.data}).catch(error => {console.error(error)});
}
exports.api_post =async function(url,data){
    return await axios.post(url,data).then(res => { return res.data}).catch(error => {console.error(error)});
}