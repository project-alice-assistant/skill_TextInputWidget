let token = '';
let ip = '';

function login(user, pin) {
	let form = new FormData();
	form.append('username', user);
	form.append('pin', pin);

	let settings = {
		'url': '/api/v1.0.1/login/',
		'method': 'POST',
		'timeout': 0,
		'processData': false,
		'mimeType': 'multipart/form-data',
		'contentType': false,
		'data': form
	};

	$.ajax(settings).done(function (response) {
		let json = eval('(' + response + ')');
		token = json.apiToken;
		$('#TextInputWidget_login').hide();
		$('#TextInputWidget_query').show()
	});

}

function process(token, siteID, qry) {
	let form = new FormData();
	form.append('query', qry);
	form.append('siteId', siteID);
	let settings = {
		'url': '/api/v1.0.1/dialog/process/',
		'method': 'POST',
		'timeout': 0,
		'headers': {
			'auth': token
		},
		'processData': false,
		'mimeType': 'multipart/form-data',
		'contentType': false,
		'data': form
	};

	$.ajax(settings).done(function (response) {
		console.log(response);
	});
}

function doLogin() {
	login($('#username').val(), $('#pin').val());
}

function doLogout() {
	token = '';
	$('#TextInputWidget_login').show();
	$('#TextInputWidget_query').hide();
}

function doProcess() {
	process(token, $('#siteID').val(), $('#qry').val());
}
