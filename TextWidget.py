import requests
from requests.exceptions import RequestException

from core.base.model.AliceSkill import AliceSkill
from core.dialog.model.DialogSession import DialogSession
from core.util.Decorators import AnyExcept, IntentHandler, Online


class TextWidget(AliceSkill):
	def __init__(self):
		super().__init__()
		