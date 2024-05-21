// Title: Not found handler
// Description: Not found handler
// Author: Tazwar Saif

//module scaffolding
const handler = {};

handler.notfoundHandler = (requetProperties,callback) =>{
    console.log("404 Not found");

    callback(404,{
        message: "Your requested URL not found."
    })
}

module.exports = handler;