var fs = require('fs'); var util = require('util');
// var log_file = fs.createWriteStream(__dirname + '/node.log', {flags : 'w'});
var log_file = null;
var log_file2 = null;
var log_stdout = process.stdout;

if (fs.existsSync(__dirname + '/server.log')) {
    var read = fs.readFileSync(__dirname + '/server.log');
    log_file = fs.createWriteStream(__dirname + '/server.log', { flags: 'r+' });
    log_file.write(read);
} else {
    log_file = fs.createWriteStream(__dirname + '/server.log', { flags: 'w' });
}

if (fs.existsSync(__dirname + '/mqtt.log')) {
    var read = fs.readFileSync(__dirname + '/mqtt.log');
    log_file2 = fs.createWriteStream(__dirname + '/mqtt.log', { flags: 'r+' });
    log_file2.write(read);
} else {
    log_file2 = fs.createWriteStream(__dirname + '/mqtt.log', { flags: 'w' });
}
//var log_file = fs.createWriteStream(__dirname + '/node.log', {flags : 'r+'});

function writeLog(d, type = 0) { //
    let date = new Date();
    if (type == 1)
        log_file2.write(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' ' + util.format(d) + '\r\n');
    else
        log_file.write(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' ' + util.format(d) + '\r\n');
};

exports.write = writeLog;