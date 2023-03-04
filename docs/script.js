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
		document.getElementById("announcements").textContent = req.responseText;
	});
	req.open("GET", "https://markham-yrhacks-2023.herokuapp.com");
	req.send();
}
