"use strict";

const SECTIONS = ["home", "announcements", "queues", "services", "events", "wintermaintenance", "pathways"];

let currentSection = "home";

function switchSection(name) {
	document.getElementById(currentSection + "Section").style.display = "none";
	document.getElementById(name + "Section").style.display = "block";
	currentSection = name;

	if (name === "announcements") {
		loadAnnouncements();
	}
}

for (const name of SECTIONS) {
	document.getElementById(name + "Button").addEventListener("click", () => switchSection(name));
}

function loadAnnouncements() {
	const req = new XMLHttpRequest();
	req.addEventListener("load", () => {
		let data = JSON.parse(req.responseText);
		let announcements = document.getElementById("announcements");
		for (const ann of data.reverse()) {
			let box = document.createElement("div");
			let title = document.createElement("h2");
			title.textContent = ann.title
			let date = document.createElement("p");
			date.className = "datetime"
			date.textContent = ann.date
			let time = document.createElement("p");
			time.className = "datetime"
			time.textContent = ann.time
			let content = document.createElement("p");
			content.textContent = ann.content

			box.appendChild(title);
			box.appendChild(date);
			box.appendChild(time);
			box.appendChild(content);
			announcements.appendChild(box);
		}
	});
	// req.open("GET", "http://localhost:3000");
	req.open("GET", "https://markham-yrhacks-2023.herokuapp.com");
	req.send();
}
