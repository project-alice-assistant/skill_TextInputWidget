class TextInputWidget_AliceSay {

	constructor(uid, widgetId) {
		this.uid = uid;
		this.widgetId = widgetId;
		this.aliceSettings = JSON.parse(window.sessionStorage.aliceSettings);
		this.myDiv = document.querySelector(`[data-ref="AliceSay_${this.uid}"]`)
		this.savedToken = '';
		this.getSites();
		this.arm();
	}

	arm() {
		let that = this
		this.myDiv.querySelector('#ASaliceSay').onclick = function (event) {
			that.aliceSay(that.myDiv.querySelector('#ASsiteID').value, that.myDiv.querySelector('#ASqry').value)
		}
	}

	aliceSay(deviceUid, qry) {
		let that = this
		let formData = new FormData
		formData.append('text', this.myDiv.querySelector('#ASqry').value)
		formData.append('deviceUid', deviceUid)
		fetch(`http://${this.aliceSettings['aliceIp']}:${this.aliceSettings['apiPort']}/api/v1.0.1/dialog/say/`, {
			method : 'POST',
			body   : formData,
			headers: {
				'auth': localStorage.getItem('apiToken'),
			}
		}).then(response => response.json())
			.then(function (response) {
				console.log('Message response: ' + response['message'])
			});
	}

	getSites() {
		let that = this
		fetch(`http://${this.aliceSettings['aliceIp']}:${this.aliceSettings['apiPort']}/api/v1.0.1/widgets/${this.widgetId}/function/getAliceDevices/`, {
			method : 'POST',
			body   : '{}',
			headers: {
				'auth'        : localStorage.getItem('apiToken'),
				'content-type': 'application/json'
			}
		}).then(response => response.json())
			.then(function (answer) {
				if ('message' in answer) {
					alert(answer['message'])
					return;
				}
				let devices = JSON.parse(answer.data)
				that.myDiv.querySelector('#ASsiteID').textContent = ''
				for (let id in devices) {
					let device = devices[id];
					if (device['name'] == that.myDiv.querySelector('#defaultSiteId').text) {
						that.myDiv.querySelector('#ASsiteID').append(new Option(device['name'], device['deviceUid'], true, true));
					} else {
						that.myDiv.querySelector('#ASsiteID').append(new Option(device['name'], device['deviceUid']));
					}
				}
			});
	}
}
