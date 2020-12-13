var Connection = require('tedious').Connection;
var sql = require("mssql");
var writelog = require('./ServerLog');
var parameters = require('./parameters');

var dbConfig = parameters.Config.sql;

function executeQuery(query, callback) {
    var connection = new sql.Connection(dbConfig);
    connection.connect(function (err) {
        // ...
        if (err) {
            console.log("Error while connecting database :- " + err);
            //res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request(connection);
            // query to the database
            request.query(query, function (err, recordset) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    //res.send(err);
                }
                else {
                    callback(recordset);
                }
            });
        }
    });
}

function executeProcedure(query, inputs, callback) {
    var connection = new sql.Connection(dbConfig);
    connection.connect(function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
        }
        else {
            // create Request object
            var request = new sql.Request(connection);
            if (inputs.length > 0) {
                for (i = 0; i < inputs.length; i++) {
                    request.input(inputs[i][0], inputs[i][1], inputs[i][2]);
                }
            }
            // query to the database
            request.execute(query, function (err, recordset) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                }
                else {
                    callback(recordset[0]);
                }
            });
        }
    });
}


function executeProcedure2(query, inputs, callback) {
    var connection = new sql.Connection(dbConfig);
    connection.connect(function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            writelog.write(err);
        }
        else {
            // create Request object
            var request = new sql.Request(connection);
            if (inputs.length > 0) {
                for (i = 0; i < inputs.length; i++) {
                    request.input(inputs[i][0], inputs[i][1], inputs[i][2]);
                }
            }
            request.on('info', function(info) {
                console.log(info);
            });
            // query to the database
            request.execute(query, function (err, recordsets, returnValue, affected) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    writelog.write(err);
                }
                else {
                    console.log(recordsets.length); // count of recordsets returned by the procedure
                    //console.log(recordsets[0].length); // count of rows contained in first recordset
                    console.log(returnValue); // procedure return value
                    console.log(recordsets.returnValue); // same as previous line
                    console.log(affected); // number of rows affected by the statemens
                    console.log(recordsets.rowsAffected); // same as previous line
                    callback(recordsets);
                }
            });
        }
    });
}

function pruebaBasic(req, res) {
    let cedula = req.query.cedula;
    if (cedula != null) {
        var query = "select * from EmpleadoBiometrico where Cedula ='" + cedula + "'";
    }
    else {
        var query = "select * from EmpleadoBiometrico";
    }
    executeQuery(res, query);
}

exports.executeQuery = executeQuery;
exports.executeProcedure = executeProcedure;
exports.executeProcedure2 = executeProcedure2;
exports.dbConfig = dbConfig;