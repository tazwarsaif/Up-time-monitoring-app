// Title: Uptime Monitoring Application
// Description: A Restful API to monitor up or down time of a user defined link
// Author: Tazwar Saif

// dependencies
const http = require("http");
const { parse } = require("path");
const handler = require("./helper");



// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// handle request response
app.handleReqRes = handler;


// server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes.handleReqRes);
    server.listen(app.config.port,()=>{
        console.log(`listening to ${app.config.port}`);
    });
}


app.createServer(); 