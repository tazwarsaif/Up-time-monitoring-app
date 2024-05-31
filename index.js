const http = require("http");
const { parse } = require("path");
const { realpath } = require("fs");
const handleReqRes = require("./helper");
const currentEnv = require("./environment");
const data = require('./lib/data')


app = {};

// data.delete('test','newfile', (err)=>{
//     console.log(err,data);
// });

app.createServer = () =>{
    const server = http.createServer(app.handleReqRes);
    server.listen(currentEnv,()=>{
        console.log(`The node environment is ${currentEnv.envName}`);
        console.log("Listening to 3000 port")
    })
}

app.handleReqRes = handleReqRes;

app.createServer();
