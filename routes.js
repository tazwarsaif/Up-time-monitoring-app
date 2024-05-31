const {sampleHandler} =  require("./sampleHandler");
const {userHandler} = require("./userHandler");
routes = {
    sample: sampleHandler,
    user: userHandler
};

module.exports = routes;
