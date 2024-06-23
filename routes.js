const {sampleHandler} =  require("./sampleHandler");
const {userHandler} = require("./userHandler");
const {tokenHandler} = require('./tokenHandler')
routes = {
    sample: sampleHandler,
    user: userHandler,
    token : tokenHandler
};

module.exports = routes;
