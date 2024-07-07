var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start () {
	},

	async socketNotificationReceived (notification, payload) {
		if (notification === "getJson_s") {
			var self = this;
			try {
				const response = await fetch(payload);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				self.sendSocketNotification("getJson_r", data);
			} catch (error) {
				console.log(error);
			}
		}
	}
});
