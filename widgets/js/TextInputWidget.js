var token = "";
var ip = "";
function login(user, pin) {
	var form = new FormData();
	form.append("username", user);
	form.append("pin", pin);
	
	var settings = {
	  "url": "/api/v1.0.1/login/",
	  "method": "POST",
	  "timeout": 0,
	  "processData": false,
	  "mimeType": "multipart/form-data",
	  "contentType": false,
	  "data": form
	};

	$.ajax(settings).done(function (response) {
	  json = eval("(" + response + ")")
	  token = json.apiToken;
	  let divlogin = document.getElementById("TextInputWidget_login");
	  divlogin.style.display = "none";
	  let divquery = document.getElementById("TextInputWidget_query");
	  divquery.style.display = "block";
	});

}

function process(token, siteID, qry) {
	var form = new FormData();
	form.append("query", qry);
	form.append("siteId", siteID);
	var settings = {
	  "url": "/api/v1.0.1/dialog/process/",
	  "method": "POST",
	  "timeout": 0,
	  "headers": {
		"auth": token
	  },
	  "processData": false,
	  "mimeType": "multipart/form-data",
	  "contentType": false,
	  "data": form
	};

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});
}
function doLogin(){
	var username = document.getElementById("username").value;
	var pin = document.getElementById("pin").value;
	login(username, pin);
}
function doLogout(){
	token = ""
	let login = document.getElementById("TextInputWidget_login");
	login.style.display = "block";
	let divquery = document.getElementById("TextInputWidget_query");
	divquery.style.display = "none";
}
function doProcess(){
	var siteID = document.getElementById("siteID").value;
	var query = document.getElementById("qry").value;
	process(token, siteID, query);
}
