hander = {};
handler.notFound = (requestProperties,callback) =>{
    console.log(requestProperties);
    callback(404,{
        message: "404 not found."
    })
}

module.exports = handler;