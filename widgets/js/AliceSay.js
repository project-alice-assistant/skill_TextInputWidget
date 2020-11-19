$(function () {
	let savedToken = '';
	let remember = false;

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

			$('#ASTextInputWidget_login').hide();
			$('#ASTextInputWidget_query').show()
		});

	}

	function aliceSay(token, siteID, qry, sessionId) {
		let url = '/api/v1.0.1/dialog/say/';
		let form = new FormData();
		form.append('text', qry);
		form.append('siteId', siteID);
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

	function getSites(){
		$.ajax({
			url: '/home/widget/',
			data: JSON.stringify({
				skill: 'TextInputWidget',
				widget: 'AliceSay',
				func: 'getAliceDevices',
				param: ''
			}),
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST'
		}).done(function (answer) {
			if('message' in answer){
				alert(answer['message'])
				return;
			}
			$.each(answer, function (i, val) {
				if(val['name'] == $('#defaultSiteId').text()){
					$('#ASsiteID').append(new Option(val['name'], val['siteId'], true, true));
				} else {
					$('#ASsiteID').append(new Option(val['name'], val['siteId']));
				}
			});
		});
	}

	$('#ASlogin').on('click', function () {
		let username = $('#ASusername').val().trim();
		let pin = $('#ASpin').val().trim();
		if (remember) {
			document.cookie = 'SimpleCommand_username=' + username;
			document.cookie = 'SimpleCommand_pin=' + pin;
		}
		login(username, pin);
	});

	$('#ASlogout').on('click touchstart', function () {
		savedToken = '';
		$('#ASTextInputWidget_login').show();
		$('#ASTextInputWidget_query').hide();
	});

	$('#ASaliceSay').on('click touchstart', function () {
		aliceSay(savedToken, $('#ASsiteID').val(), $('#ASqry').val());
	});

	$('#ASqry').on('keydown', function(e) {
		if (e.key == 'Enter') {
			aliceSay(savedToken, $('#ASsiteID').val(), $('#ASqry').val());
		}
	});

	$('#ASpin').on('keydown', function(e) {
		if (e.key == 'Enter') {
			login($('#ASusername').val(), $('#ASpin').val());
		}
	});

	$('#ASrememberMe').on('click touchstart', function() {
		remember = !!$(this).is(':checked');

		if (!remember) {
			document.cookie = 'apiToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
		}
	});

	getSites();

	let c_username = getCookie('SimpleCommand_username');
	let c_pin = getCookie('SimpleCommand_pin');
	if (c_username != '' && c_pin != '') {
		login(c_username, c_pin);
	}
});
