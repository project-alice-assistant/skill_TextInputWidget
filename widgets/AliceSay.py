import json
import sqlite3
from core.device.model.DeviceAbility import DeviceAbility
from core.webui.model.Widget import Widget
from core.webui.model.WidgetSizes import WidgetSizes


class AliceSay(Widget):
	DEFAULT_SIZE = WidgetSizes.w_wide
	DEFAULT_OPTIONS: dict = {
		'defaultSiteId'      : '',
		'defaultUser'        : '',
		'unencryptedPassword': ''
	}
	OPTIONS: dict = dict()


	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def getAliceDevices(self):
		devices = self.DeviceManager.getDevicesWithAbilities(abilities=[DeviceAbility.PLAY_SOUND])
		return json.dumps([{'name': device.displayName if device.displayName else device.getLocation().name, 'deviceUid': device.uid} for device in devices])
