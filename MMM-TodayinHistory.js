/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: TodayinHistory
 *
 * By 胡迪
 */

Module.register("MMM-TodayinHistory", {
	defaults: {
		apiUrl: "https://api.oick.cn/lishi/api.php",
		updateInterval: 15 * 1000,
		animationSpeed: 1000,
	},
	async getFact() {
		try {
			const response = await fetch(this.config.apiUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			this.index = 0;
			return data;
		} catch (error) {
			Log.info(error);
			return null;
		}
	},

	updateFact() {
		this.updateDom(this.config.animationSpeed);
	},

	getScripts() {
		return ["moment.js"];
	},

	scheduleUpdateRequest: function (specifiedDelay) {
		var self = this;
		setInterval(function () {
			self.updateFact();
		}, specifiedDelay);
	},

	start() {
		Log.info(`Starting module: ${this.name}`);
		this.getFact().then((data) => {
			Log.info(data);
			this.HistoryData = data.result;
			this.updateDom(this.config.animationSpeed);
		});
		this.updateFactAtMidnight();
		this.scheduleUpdateRequest(this.config.updateInterval);
	},
	getRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getDom() {
		if (!this.HistoryData) {
			const wrapper = document.createElement("div");
			const loading = document.createElement("div");
			loading.innerHTML = "数据获取中...";
			wrapper.appendChild(loading);
			this.getFact().then((data) => {
				Log.info(data);
				this.HistoryData = data.result;
				this.updateDom(this.config.animationSpeed);
			});
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

		titleWrapper.innerHTML = "历史上的今天——";
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

	updateFactAtMidnight: function () {
		const self = this;
		setInterval(function () {
			const time = moment(Date.now()).format("HH:mm:ss");
			if (time === "00:00:00") {
				self.getFact();
			}
		}, 1000);
		Log.info("午夜更新数据");
	},
});
