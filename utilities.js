const crypto = require('crypto');
const environment = require('./environment');
utilities = {};

utilities.parseJSON = (jsonString)=>{
    let output={};

    try{
        output = JSON.parse(jsonString);
    }
    catch{
        output = {};
    }
    return output;
}


utilities.hash = (str)=>{
    if(typeof(str) === 'string' && str.length >0){
        const hash = crypto
        .createHmac('sha256',environment.secretKey)
        .update(str)
        .digest('hex');
        return hash;
    }
    else{
        return false
    }
}

utilities.createRandomStr = (strlen)=>{
    let lenght = strlen;
    length = typeof(strlen) === 'number' && strlen >0 ? strlen :false;
    if(length){
        let possibleChars = 'qwertyuiopasdfghjklzxcvbnm1234567890';
        let output = '';
        for(let i = 1; i<=length; i ++){
            let randomchar = possibleChars.charAt(Math.floor(Math.random()*possibleChars.length));
            output += randomchar;
        }
        return output;
    }else{
        return false
    }
}

module.exports = utilities;