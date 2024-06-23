const data  = require("./lib/data")
const {hash} = require('./utilities')
const {createRandomStr} = require('./utilities')
const {parseJSON} = require('./utilities')
// const {hash} = require('./utilities')
// const {parseJSON} = require('./utilities')

handler= {};
handler.tokenHandler = (requestProperties,callback) =>{
    console.log(requestProperties);
    const acceptedMethods = ['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._token[requestProperties.method](requestProperties,callback)
    }else{
        callback(405);
    }
}


handler._token = {};
handler._token.post = (requestProperties,callback)=>{
    
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length ===11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone && password){
        data.read('users',phone,(err,userData)=>{
            let hashedpassword = hash(password);
            if(hashedpassword === parseJSON(userData).password){
                let tokenId = createRandomStr(20);
                let expires = Date.now() + 60*60*1000;
                let tokenobj = {
                    'phone' : phone,
                    'id' : tokenId,
                    expires
                }

                data.create('token',tokenId,tokenobj,(err)=>{
                    if(!err){
                        callback(200,tokenobj);
                    }else{
                        callback(500,{
                            'error': 'Server SIde error'
                        });
                    }
                })
            }else{
                callback(400,{
                    'error': 'Incorrect Password.'
                })        
            }
        })

    }else{
        callback(400,{
            'error': 'You have a problem in your request.'
        })
    }
}
handler._token.get = (requestProperties,callback)=>{
    const id = typeof(requestProperties.queryStrObj.id) === 'string' && requestProperties.queryStrObj.id.trim().length ===20 ? requestProperties.queryStrObj.id : false;
    if(id){
        data.read('token',id, (err,tu)=>{
            const token = {...parseJSON(tu)};
            if(!err && token){
                delete token.password;
                callback(200, token);
            }else{
                callback(404, {'error': 'requested token not found'});
            }
        })
    }else{
        callback(404, {'error': 'requested token not found'})
    }
}
handler._token.put = (requestProperties,callback)=>{
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length ===20 ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;
    if(id && extend){
        data.read('token',id,(err,tokenData)=>{
            let tokenObj = parseJSON(tokenData); 
            if(tokenObj.expires > Date.now()){
                tokenObj.expires = Date.now() + 60*60*60;
                data.update('token',id,tokenObj,(err)=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500, {'error': 'There was a serverside error.'})
                    }
                })
            }else{
                callback(404, {'error': 'Token was expired.'})
            }
        })
    }else{
        callback(404, {'error': 'There was a problem in your request.'})
    }
}
handler._token.delete = (requestProperties,callback)=>{
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.queryStrObj.id.trim().length ===20 ? requestProperties.queryStrObj.id : false;

    if(id){
        data.read('token',id,(err,tdata)=>{
            if(!err){
                data.delete('token',id,(err)=>{
                    if(!err){
                        callback(200,{'message':'Token was successfully deleted'})
                    }else{
                        callback(500,{'error':'Server side error!'})
                    }
                })
            }else{
                callback(500,{'error':'Server side error!'})
            }
        })
    }else{
        callback(400,{'error':'THere was a problem in your request.'})
    }
}
handler._token.verify = (id,phone,callback) => {
    data.read('token',id,(err,tdata)=>{
        if(!err && tdata){
            if(parseJSON(tdata).phone === phone && parseJSON(tdata).expires > Date.now){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
}

module.exports = handler;