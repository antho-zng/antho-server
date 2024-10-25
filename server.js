const http = require("http");
const { PORT, HOMEPAGE_MESSAGE } = require("./constants");

const server = http.createServer((req, res) => {
  //TODO: detailed routing, error codes + handling
  res.writeHead(200, { "Content-Type": "text/plain" }); //TODO: clean up hardcoded status numbers/headers
  res.end(HOMEPAGE_MESSAGE);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
