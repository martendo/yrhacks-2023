"use strict";

//const WSS_URL = "ws://localhost:3000";
const WSS_URL = "wss://markham-yrhacks-2023.herokuapp.com";

const SECTIONS = ["home", "announcements", "queues", "services", "events", "wintermaintenance", "pathways", "moreresources"];

let currentSection = "home";
let announcementData = [];

let queues = {};

function switchSection(name) {
	document.getElementById(currentSection + "Section").style.display = "none";
	document.getElementById(name + "Section").style.display = "block";
	currentSection = name;
}

function displayQueues() {
	const tbody = document.getElementById("queues");
	while (tbody.firstChild) {
		tbody.removeChild(tbody.lastChild);
	}
	const queueNames = document.getElementById("queueName");
	while (queueNames.firstChild) {
		queueNames.removeChild(queueNames.lastChild);
	}
	const namerow = tbody.insertRow();
	const listrow = tbody.insertRow();
	for (const [name, queue] of Object.entries(queues)) {
		const option = document.createElement("option");
		option.textContent = name;
		option.value = name;
		queueNames.appendChild(option);
		const ol = document.createElement("ol");
		for (const user of queue) {
			const li = document.createElement("li");
			li.textContent = user.name;
			if (user.contact.length !== 0) {
				li.textContent += ` (${user.contact})`;
			}
			ol.appendChild(li);
		}
		namerow.insertCell().innerHTML = `<b>${name}</b>`;
		listrow.insertCell().appendChild(ol);
	}
}

function loadAnnouncements() {
	let announcements = document.getElementById("announcements");
	let order = document.getElementById("announcementSortOrder");
	announcements.innerHTML = "";

	let data = announcementData.slice();
	switch (order.options[order.selectedIndex].value) {
		case "0":
			data.reverse();
			break;
		case "1":
			break;
		case "2":
			data.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
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
document.getElementById("queueTurnModalOk").addEventListener("click", () => {
	document.getElementById("queueTurnModal").style.display = "none";
});

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
	switch (data[0]) {
		case "announcements":
			if (announcementData.length !== 0) {
				document.getElementById("newAnnouncement").innerHTML = `"${data[1][data[1].length - 1].title}" &mdash; go take a look!`;
				document.getElementById("announcementModal").style.display = "grid";
			}
			announcementData = data[1];
			loadAnnouncements();
			break;
		case "queued":
			queues = data[1];
			displayQueues();
			break;
		case "queue-turn":
			document.getElementById("queueTurnModal").style.display = "grid";
			break;
		case "chat-response":
			const message = document.createElement("p");
			message.innerHTML = `<strong>Assistant</strong><br>${data[1]}`;
			document.getElementById("chatMessageBox").appendChild(message);
			break;
	}
});

document.getElementById("enqueue").addEventListener("click", () => {
	socket.send(JSON.stringify(["enqueue", document.getElementById("queueName").value, {
		name: document.getElementById("userName").value,
		contact: document.getElementById("userContact").value,
	}]));
});

document.getElementById("chatSend").addEventListener("click", () => {
	const content = document.getElementById("chatInput").value;
	socket.send(JSON.stringify(["chat-message", content]));
	const message = document.createElement("p");
	message.innerHTML = `<strong>You</strong><br>${content}`;
	document.getElementById("chatMessageBox").appendChild(message);
});
