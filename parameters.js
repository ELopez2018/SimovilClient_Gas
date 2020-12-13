var fs = require('fs');

var ConfigEncoded = fs.readFileSync('station.config', 'utf-8');
var ConfigDecoded = Buffer.from(ConfigEncoded, 'base64').toString();
var Config = JSON.parse(ConfigDecoded);

exports.Config = Config;