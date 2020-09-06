$(function () {
	let savedToken = '';
	let remember = false;
	let topics = [
		'hermes/dialogueManager/sessionEnded'
	]

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
				unsetCookie('SimpleCommand_username')
				unsetCookie('SimpleCommand_pin')
				return;
			}

			$('#TextInputWidget_login').hide();
			$('#TextInputWidget_query').show()
		});

	}

	function process(token, siteID, qry, sessionId) {
		let url = '';
		if(sessionId == ''){
			url = '/api/v1.0.1/dialog/process/';
		} else {
			console.log(sessionId)
			url = '/api/v1.0.1/dialog/continue/';
		}
		let form = new FormData();
		form.append('query', qry);
		form.append('siteId', siteID);
		form.append('sessionId', sessionId);
		let settings = {
			'url': url,
			'method': 'POST',
			'timeout': 0,
			'headers': {
				'auth': token
			},
			'processData': false,
			'mimeType': 'multipart/form-data',
			'contentType': false,
			'dataType': 'json',
			'data': form
		};

		$.ajax(settings).done(function (response) {
		 	$('#sessionId').val(response['sessionId']);
		});
	}

	$('#login').on('click', function () {
		let username = $('#username').val().trim();
		let pin = $('#pin').val().trim();
		if (remember) {
			document.cookie = 'SimpleCommand_username=' + username;
			document.cookie = 'SimpleCommand_pin=' + pin;
		}
		login(username, pin);
	});

	$('#logout').on('click touchstart', function () {
		savedToken = '';
		$('#TextInputWidget_login').show();
		$('#TextInputWidget_query').hide();
	});

	$('#process').on('click touchstart', function () {
		process(savedToken, $('#siteID').val(), $('#qry').val(), $('#sessionId').val());
	});

	$('#qry').on('keydown', function(e) {
		if (e.key == 'Enter') {
			process(savedToken, $('#siteID').val(), $('#qry').val(), $('#sessionId').val());
		}
	});

	$('#pin').on('keydown', function(e) {
		if (e.key == 'Enter') {
			login($('#username').val(), $('#pin').val());
		}
	});

	function onConnect() {
		for (const topic in topics) {
			MQTT.subscribe(topic);
		}
	}

	function onMessage(msg) {
		if (!topics.includes(msg.topic) || !msg.payloadString) {
			return;
		}
		//msg to json, get 'text'
		let json = JSON.parse(msg.payloadString);
		if (msg.destinationName == 'hermes/dialogueManager/sessionEnded') {
			if( $('#sessionId').val() == json['sessionId'] ){
				$('#sessionId').val("");
			}
		}
	}

	$('#rememberMe').on('click touchstart', function() {
		remember = !!$(this).is(':checked');

		if (!remember) {
			document.cookie = 'apiToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
		}
	});

	mqttRegisterSelf(onConnect, 'onConnect');
	mqttRegisterSelf(onMessage, 'onMessage');

	let c_username = getCookie('SimpleCommand_username');
	let c_pin = getCookie('SimpleCommand_pin');
	if (c_username != '' && c_pin != '') {
		login(c_username, c_pin);
	}
});
