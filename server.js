import { WebSocketServer } from "ws";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";

const api = new ChatGPTUnofficialProxyAPI({
	accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJkYW51YmNvZGluZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IkNBIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1VNUIxWkpmN01yOVFYTGx2cWllTGx2aXEifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE1NDUyOTE4NjAzNzE3NDg0NTMzIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3Nzg5NTE5MiwiZXhwIjoxNjc5MTA0NzkyLCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.xc4fXSVdmqL3HfJz0kDysso4iY_ycLffPR8Z4v_XzXBH0eIdOnHRz5s9K1NfFUANIRn98K1l-xJrMhJOTFtuGhK7uIWuULKS9X9AQb92hDeJWNoMI-26Zswam00w-sVPIHpPP8IpYmztMafBBKfbfv15zGz3mufAdcL3KJsgYgLADIY2GxrxOKKXlIh24uRX5HjNKBUWfeVE1NMc6VRrCK1Xuhra2Bs3odZDvJjvEkY5ZA_AdlOHWp51wPG8d9DCyhMEyMynaD1WS3Sg3_O9CSH_7pW6swuM14VlMszm7uhrKPBv5RVBy5q7ptWMGjhpOFXbZBAMIXFJesaLzp4tcw",
});

const defannouncements = [
	// ChatGPT wrote the announcements lol, can't be bothered
	{
		"date": "Jan 1, 2023",
		"time": "12:00 AM",
		"title": "Welcome to 2023!",
		"content": "As of 2023, the new year has begun with a sense of hope and renewal. After two years of global upheaval due to the COVID-19 pandemic, people around the world are looking forward to a fresh start. While the pandemic is not yet over, the availability of vaccines and improved treatment options have brought a degree of stability and optimism. Many are making resolutions and setting goals for the year ahead, while others are simply grateful for the opportunity to spend time with loved ones and appreciate the small joys in life. As we move into 2023, there is a sense of unity and solidarity as people work together to overcome challenges and create a brighter future."
	},
	{
		"date": "Feb 9, 2023",
		"time": "5:35 PM",
		"title": "Potential storm incoming, school closures?",
		"content": "Due to the inclement weather forecasted for tomorrow, there is a possibility that schools may need to close for the day. The safety and well-being of students, faculty, and staff are of the utmost importance, and school officials will be closely monitoring weather conditions to make the best decision possible. In the event of a closure, students will be notified through various channels, such as social media, school websites, and local news outlets. Parents and guardians are encouraged to stay tuned to these sources for updates and to make alternative arrangements for their children if necessary. While a school closure can be inconvenient, it is important to prioritize safety during extreme weather conditions."
	},
	{
		"date": "Mar 3, 2023",
		"time": "6:00 PM",
		"title": "YRHacks 2023",
		"content": "Now, the event is starting! YRHacks 2023, the annual hackathon held in Markham, Ontario, by the York Region District School Board (YRDSB), has officially begun. Students from around the world are gearing up for a weekend of collaboration, learning, and innovation. With a focus on creativity and problem-solving, participants will work in teams to develop new projects in a variety of fields, from software development to artificial intelligence. The hackathon is an excellent opportunity for young people to challenge themselves, learn new skills, and connect with industry experts. Whether attending in-person or virtually, YRHacks 2023 is sure to be an exciting and rewarding experience for all involved."
	}
];
let announcements = defannouncements.slice();

const wss = new WebSocketServer({port: process.env.PORT || 3000});

class Client {
	constructor(connection) {
		this.connection = connection;
		this.isAlive = true;
		this.lastId = null;
		this.convId = null;
	}

	send(data) {
		this.connection.send(JSON.stringify(data));
	}
}

const clients = new Set();

const queue = [];

function broadcastAnnouncements() {
	for (const client of clients) {
		client.send(["announcements", announcements]);
	}
}

function broadcastQueue() {
	const userqueue = [];
	for (const user of queue) {
		userqueue.push(user[0]);
	}
	for (const client of clients) {
		client.send(["queued", userqueue]);
	}
}

async function askGPT(client, prompt) {
	let res;
	if (client.lastId !== null && client.convId !== null) {
		res = await api.sendMessage(prompt, {
			parentMessageId: client.lastId,
			conversationId: client.convId,
		});
	} else {
		res = await api.sendMessage(prompt);
	}
	client.lastId = res.id;
	client.convId = res.conversationId;
	client.send(["chat-response", res.text]);
}

wss.on("connection", (socket) => {
	console.log("Client connected");
	const client = new Client(socket);
	clients.add(client);
	socket.on("error", (error) => {
		console.error(error);
	});
	socket.on("pong", () => {
		client.isAlive = true;
	});
	const interval = setInterval(() => {
		if (!client.isAlive) {
			return socket.terminate();
		}
		client.isAlive = false;
		socket.ping();
	}, 10000);
	socket.on("close", (code) => {
		clients.delete(socket);
		clearInterval(interval);
		console.log(`Client disconnected (${code})`);
		socket.close();
	});
	socket.on("message", (message) => {
		const data = JSON.parse(message);
		console.log("Message", data);
		switch (data[0]) {
			case "new-announcement":
				announcements.push(data[1]);
				broadcastAnnouncements();
				break;
			case "reset-announcements":
				announcements = defannouncements.slice();
				broadcastAnnouncements();
				break;
			case "enqueue":
				queue.push([data[1], client]);
				broadcastQueue();
				break;
			case "queue-pop":
				const user = queue.shift();
				broadcastQueue();
				user[1].send(["queue-turn"]);
				break;
			case "chat-message":
				askGPT(client, "Markham " + data[1]);
				break;
		}
	});
	client.send(["announcements", announcements]);
	const userqueue = [];
	for (const user of queue) {
		userqueue.push(user[0]);
	}
	client.send(["queued", userqueue]);
});
