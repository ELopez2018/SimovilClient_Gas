var dbLocal = require('./dbSql');
var consumeSimovil = require('./ConsumeSimovil');
var sql = require("mssql");
var parameters = require('./parameters');
var codStation = parameters.Config.station;
var simovil = parameters.Config.simovil;
//var TipoDB = 'L';	// Liquidos
var TipoDB = 'G';	// Gas
// var TipoDB = 'M';	// Mixta


LecturaTurno();

setTimeout(() => {
	LecturaTurno2();
}, 0.5);

function LecturaTurno() {
	var query = "SimovilLecturaTurno";
//	let fecha = '20201210';
	let fecha = null;
	var inputs = [
		['fecha', sql.VarChar(8), fecha]
	];
	dbLocal.executeProcedure(query, inputs, function (result) {
		console.log(result);
		if (result.length > 0) {
			insertarLecturasTurnos(result);
		}

	});
}

function insertarLecturasTurnos(lecturas) {
	let lecturaTurno = { codStation, lecturas, TipoDB };
	consumeSimovil.PostSimovil(simovil.url + '/api/lecturaTurno', lecturaTurno, function (result) {
		console.log(result);
	});
}

function LecturaTurno2() {
	var query = "SimovilLecturaTurno2";
	//	let fecha = '20191031';
	let fecha = null;
	var inputs = [
		['fecha', sql.VarChar(8), fecha]
	];
	dbLocal.executeProcedure(query, inputs, function (result) {
		// console.log(result);
		if (result.length > 0)
			insertarLecturasTurnos2(result);
	});
}

function insertarLecturasTurnos2(lecturas) {
	let lecturaTurno = { codStation, lecturas, TipoDB };
	consumeSimovil.PostSimovil(simovil.url + '/api/lecturaFinTurno', lecturaTurno, function (result) {
		console.log(result);
	});
}