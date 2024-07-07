/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: TodayinHistory
 * Magic Mirror历史上的今天模块。
 * By 胡迪
 */

Module.register("MMM-TodayinHistory", {
	defaults: {
		apiUrl: "https://api.oick.cn/lishi/api.php",
		updateInterval: 15 * 1000,
		animationSpeed: 1000
	},
	getFact () {
		this.sendSocketNotification("getJson_s", this.config.apiUrl);
	},

	getScripts () {
		return ["moment.js"];
	},

	scheduleUpdateRequest (specifiedDelay) {
		var self = this;
		setInterval(function () {
			self.updateDom(self.config.animationSpeed);
		}, specifiedDelay);
	},

	start () {
		Log.info(`Starting module: ${this.name}`);
		this.setUpdateFactAtMidnight();
		this.scheduleUpdateRequest(this.config.updateInterval);
	},

	getDom () {
		if (!this.HistoryData) {
			const wrapper = document.createElement("div");
			const loading = document.createElement("div");
			loading.className = "title bright medium normal";
			loading.innerHTML = "数据获取中...";
			wrapper.appendChild(loading);
			this.sendSocketNotification("getJson_s", this.config.apiUrl);
			return wrapper;
		}

		const wrapper = document.createElement("div");
		const titleWrapper = document.createElement("div");
		const yearWrapper = document.createElement("span");
		const colonWrapper = document.createElement("span");
		const factWrapper = document.createElement("div");

		wrapper.className = "container";
		titleWrapper.className = "title bright medium normal";
		yearWrapper.className = "title bright medium light";
		colonWrapper.className = "title bright medium normal";
		factWrapper.className = "title bright xlarge light";

		titleWrapper.innerHTML = "历史上的今天—";
		yearWrapper.innerHTML = this.HistoryData[this.index].date;
		colonWrapper.innerHTML = ":";
		factWrapper.innerHTML = this.HistoryData[this.index].title;

		titleWrapper.appendChild(yearWrapper);
		titleWrapper.appendChild(colonWrapper);

		wrapper.appendChild(titleWrapper);
		wrapper.appendChild(factWrapper);
		this.index++;
		if (this.index >= this.HistoryData.length - 1) {
			this.index = 0;
		}
		return wrapper;
	},

	setUpdateFactAtMidnight () {
		const self = this;
		setInterval(function () {
			const time = moment(Date.now()).format("HH:mm:ss");
			if (time === "00:00:00") {
				this.HistoryData = null;
				self.getFact();
				Log.info("午夜更新数据。");
			}
		}, 1000);
	},
	socketNotificationReceived (notification, payload) {
		if (notification === "getJson_r") {
			Log.info("获取当天数据。");
			this.index = 0;
			this.HistoryData = payload.result;
			this.updateDom(this.config.animationSpeed);
		}
	}
});
