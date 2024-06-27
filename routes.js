const {sampleHandler} =  require("./sampleHandler");
const {userHandler} = require("./userHandler");
const {tokenHandler} = require('./tokenHandler');
const {checkHandler} = require('./checkHandler');
routes = {
    sample: sampleHandler,
    user: userHandler,
    token : tokenHandler,
    check : checkHandler,
};

module.exports = routes;
