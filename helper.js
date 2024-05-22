// Title: Request handle 
// Description: Handling request
// Author: Tazwar Saif

//dependencies
const {StringDecoder} = require("string_decoder");
const url = require("url");
const routes =  require("./routes");
const {notfoundHandler} =  require("./notfoundHandler");
const handler = require("./sampleHandler");
//app scaffolding
app = {}

handler.handleReqRes = (req,res)=>{
    //req handle
    //get that url and parse it
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,""); //regular expression
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;

    const requetProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headers,
    }
    
    const decoder = new StringDecoder("utf-8")
    let realdata = ''

    const choserHandler = routes[trimmedPath] ? routes[trimmedPath] : notfoundHandler;

    req.on('data',(buffer)=>{
        realdata += decoder.write(buffer);
    })
    req.on("end",()=>{
        realdata += decoder.end();

        choserHandler(requetProperties,(statusCode, payload)=>{
        statusCode = typeof(statusCode) === "number" ? statusCode : 500;
        payload = typeof(payload) === "object" ? payload : {};

        const payloadString = JSON.stringify(payload);

        res.writeHead(statusCode);
        res.end(payloadString);
    })
        // response handle
       
    })
}


module.exports = handler;
