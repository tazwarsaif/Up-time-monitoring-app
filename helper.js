const url = require("url");
const {StringDecoder} = require("string_decoder");
const routes = require("./routes");
const {notFound} = require("./not foundd");
const {parseJSON} = require("./utilities")
app = {};

app.handleReqRes = (req,res) => {
    const parsedURL = url.parse(req.url,true);
    const path = parsedURL.pathname;
    const trimmedpath = path.replace(/^\/+|\/+$/g,"");
    const method = req.method.toLowerCase();
    const queryStrObj = parsedURL.query;
    const headObj = req.headers;
    const requestProperties = {
        parsedURL,
        path,
        trimmedpath,
        queryStrObj,
        headObj,
        method,
    }
    const decoder = new StringDecoder('utf-8');
    const choosenHandler = routes[trimmedpath] ? routes[trimmedpath] : notFound;
    realdata = "";

    req.on('data',(chunk)=>{
        realdata += decoder.write(chunk);
        
    })
    req.on("end",()=>{
        realdata += decoder.end();
        requestProperties.body = parseJSON(realdata);

        choosenHandler(requestProperties,(status_code,payload)=>{
            status_code = typeof(status_code) === "number" ? status_code : 500;
            payload = typeof(payload) === "object" ? payload : {};
            let payloadstr = JSON.stringify(payload);
            // res.setHeader('Content-Type','application/json');
            res.writeHead(status_code,{'Content-Type' : 'application/JSON'});
            res.end(payloadstr)
        })
    })

}

module.exports = app.handleReqRes;