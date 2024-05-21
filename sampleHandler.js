// Title: Sample Handler
// Description: Sample Handler
// Author: Tazwar Saif

//module scaffolding
const handler = {};

handler.sampleHandler = (requetProperties,callback) =>{
    console.log(requetProperties);
    callback(200,{
        message: "This is a Sample URl"
    });
}

module.exports = handler;