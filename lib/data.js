const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname,'/../.data/');

lib.create = function(dir, file, data, callback) {
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            const strData = JSON.stringify(data);
            fs.writeFile(fileDescriptor,strData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        }else{  
                            callback("Error closing the new file");
                        }
                    })
                }else{
                    callback('error writing to new file')
                }
            })
        }else{
            callback('Could not create New file. It may already exist.')
        }
    });
}

lib.read = (dir,file,callback)=>{
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf-8',(err,data)=>{
        callback(err,data);
    })
}


lib.update = (dir,file,data,callback) =>{
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            const strData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                    fs.writeFile(fileDescriptor,strData,(err=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    console.log(fileDescriptor)
                                    callback(false)
                                }else{
                                    callback("error closing file!")
                                }
                            })
                        }else{
                            callback("error writing to file")
                        }
                    }))
                }else{
                    callback("Error Truncating File!")
                }
            })
        } else{
            callback("Error uppdating. File may not exist")
        }
    })
}

lib.delete = (dir,file,callback)=>{
    fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false)
        }else{
            callback("error deleting file.")
        }
    })
}

module.exports = lib;