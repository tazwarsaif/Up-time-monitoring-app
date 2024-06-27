const data  = require("./lib/data")
const {hash} = require('./utilities')
const {parseJSON,createRandomStr} = require('./utilities')
const tokenHandler = require('./tokenHandler')
const {maxChecks} = require('./environment');



handler= {};
handler.checkHandler = (requestProperties,callback) =>{
    console.log(requestProperties);
    const acceptedMethods = ['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._check[requestProperties.method](requestProperties,callback)
    }else{
        callback(405);
    }
}


handler._check = {};
handler._check.post = (requestProperties,callback)=>{
    let protocol = type(requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = type(requestProperties.body.url) === 'string' && requestProperties.body.url.trim.length() > 0 ? requestProperties.body.url : false;

    let method = type(requestProperties.body.method) === 'string' && ['get','post','delete','put'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCode = type(requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    let timeoutSec = type(requestProperties.body.timeoutSec) === 'string' && requestProperties.body.timeoutSec % 1 === 0 && requestProperties.body.timeoutSec >= 1 && requestProperties.body.timeoutSec <= 5 ? requestProperties.body.timeoutSec : false;

    if(protocol && url && successCode && timeoutSec){
        let token = typeof(requestProperties.headObj.token) === 'string' ? requestProperties.headObj.token: false;

        data.read('token',token,(err,tdata)=>{
            if(!err && tdata){
                let userPhone = parseJSON(tdata).phone;
                data.read('users',userPhone,(err,userData)=>{
                    if(!err && userData){
                        tokenHandler._token.verify(token,userPhone,(tokenValid)=>{
                            if(tokenValid){
                                let userObj = parseJSON(userData);
                                let userChecks = typeof(userObj.checks) === 'object' && userObj.checks instanceof Array ? userObj.checks : [];
                                

                                if(userChecks.length<maxChecks){
                                    let checkId = createRandomStr(20);
                                    let checkobj = {
                                        'id' : checkId,
                                        'userPhone' : userPhone,
                                        'protocol' : protocol,
                                        'url' : url,
                                        'method' : method,
                                        'successCodes' : successCode,
                                        timeoutSec
                                    }

                                    data.create('checks',checkId,checkobj,(err)=>{
                                        if(!err){
                                            userObj.checks = userChecks;
                                            userObj.checks.push(checkId);
                                            data.update('users',userPhone,userObj,(err)=>{
                                                if(!err){
                                                    callback(200,checkobj);
                                                }else{
                                                    callback(500,{error:'THere was a server side error'})
                                                }
                                            })
                                        }else{
                                            callback(500,{error:'THere was a server side error'})
                                        }
                                    })
                                }
                                else{
                                    callback(401,{error: 'User already limit check limit.'})
                                }
                            }else{
                                callback(403,{error: "Authentication Failed"})
                            }
                        })
                    }
                })
            }else{
                callback(403,{error: 'Authentication Failed'})
            }
        })
    }else{
        callback(400,{error: 'You have a problem in your request.'})
    }
}

handler._check.get = (requestProperties,callback)=>{
}

handler._check.put = (requestProperties,callback)=>{
}

handler._check.delete = (requestProperties,callback)=>{
}

module.exports = handler;