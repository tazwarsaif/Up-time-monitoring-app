const data  = require("./lib/data")
const {hash} = require('./utilities')
const {parseJSON} = require('./utilities')
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
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length ===11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;
    console.log(requestProperties.body)
    console.log(firstName,lastName,password,phone,tosAgreement);



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
                data.create('users',phone,userObj,(err)=>{
                    if(!err){
                        callback(200,{
                            message: 'User was created successfully!',
                        })
                    }else{
                        console.log(err)
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
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.queryStrObj.phone.trim().length ===11 ? requestProperties.queryStrObj.phone : false;
    if(phone){
        data.read('users',phone, (err,u)=>{
            const user = {...parseJSON(u)};
            if(!err && user){
                delete user.password;
                callback(200, user);
            }else{
                callback(404, {'error': 'requested user not found'});
            }
        })
    }else{
        callback(404, {'error': 'requested user not found'})
    }
}
handler._users.put = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length ===11 ? requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone){
        if(firstName || lastName || password){
            data.read('users',phone,(err,u)=>{
                const user = {...parseJSON(u)}
                if(!err && user){
                    if(firstName){
                        user.firstName = firstName;
                    }
                    if(lastName){
                        user.lastName = lastName;
                    }
                    if(password){
                        user.password = hash(password);
                    }


                    data.update('users',phone,user,(err)=>{
                        if(!err){
                            callback(200,{'message':'User was updated successfully.'})
                        }else{
                            callback(500,{'error':'THere was a problem in the server site.'})
                        }
                    })
                }else{
                    callback(400,{'error':'you have a problem in your request'})
                }
            })
        }else{
            callback(400,{'error':'you have a problem in your request'})
        }
    }else{
        callback(400,{
            'error':'Invalid Phone number. Please Try again.'
        });
    }
}
handler._users.delete = (requestProperties,callback)=>{
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.queryStrObj.phone.trim().length ===11 ? requestProperties.queryStrObj.phone : false;

    if(phone){
        data.read('users',phone,(err,udata)=>{
            if(!err){
                data.delete('users',phone,(err)=>{
                    if(!err){
                        callback(200,{'message':'User was successfully deleted'})
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

module.exports = handler;