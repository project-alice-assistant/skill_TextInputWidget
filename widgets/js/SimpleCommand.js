$(function () {
	let savedToken = '';

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
			let json = JSON.parse(response);
			savedToken = json['apiToken'];
			if(!savedToken){
				alert(json['message']);
				return;
			}
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

	$('#login').on('click', function () {
		login($('#username').val(), $('#pin').val());
	});

	$('#logout').on('click touchstart', function () {
		savedToken = '';
		$('#TextInputWidget_login').show();
		$('#TextInputWidget_query').hide();
	});

	$('#process').on('click touchstart', function () {
		process(savedToken, $('#siteID').val(), $('#qry').val());
	});

	$('#qry').on('keydown', function(e) {
		if (e.key == "Enter") {
			process(savedToken, $('#siteID').val(), $('#qry').val());
		}
	});

	$('#pin').on('keydown', function(e) {
		if (e.key == "Enter") {
			login($('#username').val(), $('#pin').val());
		}
	});
});
