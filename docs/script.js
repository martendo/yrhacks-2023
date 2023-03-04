"use strict";

const SECTIONS = ["home", "announcements", "queues", "services", "events", "wintermaintenance", "pathways"];

let currentSection = "home";

function switchSection(name) {
	document.getElementById(currentSection + "Section").style.display = "none";
	document.getElementById(name + "Section").style.display = "block";
	currentSection = name;
}

for (const name of SECTIONS) {
	document.getElementById(name + "Button").addEventListener("click", () => switchSection(name));
}
