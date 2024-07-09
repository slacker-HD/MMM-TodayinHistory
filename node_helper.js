var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start () {
	},

	async socketNotificationReceived (notification, url) {
		if (notification === "getTodayInHistory_s") {
			var self = this;
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				self.sendSocketNotification("getTodayInHistory_r", data);
			} catch (error) {
				console.log(error);
			}
		}
	}
});
