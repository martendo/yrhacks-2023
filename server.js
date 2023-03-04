const http = require("http");

const announcements = [
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

function requestListener(req, res) {
	console.log("Received request", req);
	if (req.method === "GET") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.writeHead(200);
		res.end(JSON.stringify(announcements))
	}
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3000);
