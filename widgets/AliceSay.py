import sqlite3
import json

from core.base.model.Widget import Widget
from core.base.model.WidgetSizes import WidgetSizes


class AliceSay(Widget):
	DEFAULT_SIZE = WidgetSizes.w_wide
	DEFAULT_OPTIONS: dict = {'defaultSiteId': '',
							 'defaultUser': '',
							 'unencryptedPassword':''}
	OPTIONS: dict = dict()


	def __init__(self, data: sqlite3.Row):
		super().__init__(data)


	def getAliceDevices(self):
		devices = self.DeviceManager.getAliceTypeDevices(includeMain=True,connectedOnly=False)
		return json.dumps([{'name': device.name if device.name else device.getMainLocation().name, 'siteId': device.uid} for device in devices])
