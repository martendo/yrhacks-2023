const http = require("http");

const announcements = [];

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
