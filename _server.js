const net = require("node:net");
const { HTTP_STATUS_CODES } = require("./constants");

const server = net.createServer((socket) => {
  console.log("client connected");
  socket.on("data", (data) => {
    console.log("data received");
    const requestString = data?.toString().split("\r\n") || ""; //TODO: refactor to avoid using magic number for indexing
    const requestLine = requestString[0] || "";
    /**
     * HTTP conventions specify this format for the request line:
     * <method> <resource> <version>
     * So we'll assume incoming client requests will consistently follow this format.
     */
    const [reqMethod, reqResource, reqHTTPversion] = requestLine.split(" ");
    const response = `${reqHTTPversion} ${HTTP_STATUS_CODES[200].code} ${HTTP_STATUS_CODES[200].message}\r\n\r\nRequested path: ${reqResource}\r\n`;
    console.log(response);
    socket.write(response);
    socket.end();
  });
  socket.on("end", () => {
    console.log("client disconnected");
  });
});
server.on("error", (err) => {
  throw err;
});
server.listen(80, () => {
  console.log("server bound");
});
