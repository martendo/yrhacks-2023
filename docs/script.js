"use strict";

//const WSS_URL = "ws://localhost:3000";
const WSS_URL = "wss://markham-yrhacks-2023.herokuapp.com";

const SECTIONS = ["home", "announcements", "queues", "services", "events", "wintermaintenance", "pathways"];

let currentSection = "home";
let announcementData = [];

function switchSection(name) {
	document.getElementById(currentSection + "Section").style.display = "none";
	document.getElementById(name + "Section").style.display = "block";
	currentSection = name;
}

function loadAnnouncements() {
	let announcements = document.getElementById("announcements");
	let order = document.getElementById("announcementSortOrder");
	announcements.innerHTML = "";

	let data;
	switch (order.options[order.selectedIndex].value) {
		case "0":
			data = announcementData.reverse();
			break;
		case "1":
			data = announcementData.copy();
			break;
		case "2":
			data = announcementData.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
			break;
	}

	for (const ann of data) {
		let box = document.createElement("div");
		let title = document.createElement("h2");
		title.textContent = ann.title;
		let date = document.createElement("p");
		date.className = "datetime";
		date.textContent = ann.date;
		let time = document.createElement("p");
		time.className = "datetime";
		time.textContent = ann.time;
		let content = document.createElement("p");
		content.textContent = ann.content;

		box.appendChild(title);
		box.appendChild(date);
		box.appendChild(time);
		box.appendChild(content);
		announcements.appendChild(box);
	}
}

for (const name of SECTIONS) {
	document.getElementById(name + "Button").addEventListener("click", () => switchSection(name));
}

document.getElementById("announcementSortOrder").addEventListener("change", loadAnnouncements);

const socket = new WebSocket(WSS_URL);
socket.addEventListener("error", (event) => {
	console.error("WebSocket error", event);
});
socket.addEventListener("close", (event) => {
	console.log("WebSocket closed");
});
socket.addEventListener("open", () => {
	console.log("WebSocket opened");
});
socket.addEventListener("message", (event) => {
	const data = JSON.parse(event.data);
	console.log("Message", data);
	if (data[0] === "announcements") {
		announcementData = data[1];
		loadAnnouncements();
	}
});
