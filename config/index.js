var nconf = require('nconf');
var path = require('path');
nconf.argv()
    .env()
    .file({file: path.join(__dirname,'property.json')});
module.exports = nconf;
