import sqlite3

from core.base.model.Widget import Widget
from core.base.model.WidgetSizes import WidgetSizes


class SimpleCommand(Widget):
	DEFAULT_SIZE = WidgetSizes.w_wide
	DEFAULT_OPTIONS: dict = dict()


	def __init__(self, data: sqlite3.Row):
		super().__init__(data)
