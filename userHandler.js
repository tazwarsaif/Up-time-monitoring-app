const data  = require("./lib/data")
const {hash} = require('./utilities')

handler= {};
handler.userHandler = (requestProperties,callback) =>{
    console.log(requestProperties);
    const acceptedMethods = ['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._users[requestProperties.method](requestProperties,callback)
    }else{
        callback(405);
    }
}


handler._users = {};
handler._users.post = (requestProperties,callback)=>{
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.trim().length ===11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'string' && requestProperties.body.trim().length > 0 ? requestProperties.body.tosAgreement : false;

    if(firstName && lastName && phone && password &&tosAgreement){
        data.read('users',phone,(err,user)=>{
            if(err){
                let userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                }
                data.create('user',phone,userObj,(err)=>{
                    if(!err){
                        callback(200,{
                            message: 'User was created successfully!',
                        })
                    }else{
                        callback(500,{'error':'COuldnt create User!'})
                    }
                })
            }else{ 
                callback(500,{
                    'error': "There was a problem in server side!"
                });
            }
        })
    }else{
        callback(400,{error:"You have a problem in your request"})
    }
}
handler._users.get = (requestProperties,callback)=>{
    callback(200);
}
handler._users.put = (requestProperties,callback)=>{

}
handler._users.delete = (requestProperties,callback)=>{

}

module.exports = handler;