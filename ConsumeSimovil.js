var request = require("request");
var parameters = require("./parameters");
var simovil = parameters.Config.simovil;

var token = null;
Login();

function Login() {
	let url = simovil.url + "/api/login";
	var body = simovil.user;
	// console.log(url);
	body.idUsuario = Buffer.from(body.idUsuario).toString("base64");
	body.Password = Buffer.from(body.Password).toString("base64");
	PostSimovil(url, body, function (result) {
		token = result.token;
		console.log("LOGEADO EN SIMOVIL.MILENIUMGAS.COM");
	});
}

function GetSimovil(url, callback) {
	let urlOption = {
		url: url,
		headers: {
			Authorization: "Bearer " + token
		},
		strictSSL: false
	};
	request.get(urlOption, function (error, response, body) {
		if (error != null) {
			console.log("error: " + error);
		} else {
			if (response.statusCode < 400) {
				callback(body);
			} else {
				console.log("ERROR: \x1b[41m%s\x1b[0m'",response.request.body);
				// console.log("statusCode :" + response.statusCode);
				// console.log("statusMessage :" + response.statusMessage);
			}
		}
	});
}

function PostSimovil(url, body, callback) {
	let urlOption = {
		url: url,
		headers: {
			Authorization: "Bearer " + token
		},
		json: body,
		strictSSL: false
	};
	request.post(urlOption, function (error, response, body) {
		if (error != null) {
			console.log("error: " + error);
		} else {
			if (response.statusCode < 400) {
				callback(body);
			} else {
				//console.log("ERROR: \x1b[41m%s\x1b[0m'",response.request);
				console.log("ERROR: \x1b[41m%s\x1b[0m'",response.request.response.body.message);
				// console.log("statusCode :" + response.statusCode);
				// console.log("statusMessage :" + response.statusMessage);
			}
		}
	});
}

exports.PostSimovil = PostSimovil;
exports.GetSimovil = GetSimovil;
exports.Login = Login;
