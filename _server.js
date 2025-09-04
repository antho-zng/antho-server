const net = require("node:net");
const fs = require("node:fs");
const { ALT_PORT, REQUEST_ACTIONS, HTTP_STATUS_CODES } = require("./constants");
const {
  initializeDisplayLog,
  updateDisplayLog,
  TEMP_HTML_PATH,
} = require("./services/displayService");
const {
  handleGetRequest,
  handleSetRequest,
} = require("./services/cacheService");

const { SET, GET } = REQUEST_ACTIONS;

/**
 * This creates a temporary file that we'll use to log and display server requests.
 * The file will be deleted on exit
 */
initializeDisplayLog();

const parseReqDataToJSON = (buffer) => {
  const requestString = buffer?.toString().split("\r\n") || "";
  const requestLine = requestString[0]; //TODO: refactor to avoid using magic number for indexing

  /**
   * HTTP conventions specify this format for the request line:
   * <method> <resource> <version>
   * So we'll assume incoming client requests will consistently follow this format.
   */
  const [reqMethod, reqResource, reqHttpVersion] = requestLine.split(" ");

  const requestHeaders = requestString.slice(1);
  const requestHeadersCleaned = {};
  for (line of requestHeaders) {
    const [key, value] = line.split(":");
    if (key.length > 1) {
      requestHeadersCleaned[key.toLowerCase()] = value.trim();
    }
  }
  return {
    reqMethod: reqMethod,
    reqResource: reqResource,
    reqHttpVersion: reqHttpVersion,
    ...requestHeadersCleaned,
  };
};

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const reqJSON = parseReqDataToJSON(data);

    /**
     * A `referer` header usually indicates a browser-initiated resource fetch
     * (e.g. for something like favicon.ico). We don't want to deal with those
     * on our server.
     */
    if (reqJSON["referer"]) {
      return;
    }

    /**
     * We're using a URL constructor here for (1) better readability/maintainability
     * (string manipulation methods would be kinda hacky) and (2) ease of accessing
     * `pathname` and `searchParams`
     */
    const reqURL =
      `http://${reqJSON["host"]}:${ALT_PORT}` + `${reqJSON["reqResource"]}`;
    const { pathname, searchParams } = new URL(reqURL);

    try {
      switch (pathname) {
        case SET:
          handleSetRequest(searchParams);
          break;
        case GET:
          handleGetRequest(searchParams);
          break;
        default:
          break;
      }
    } catch (error) {
      updateDisplayLog(
        `${new Date()} -- Error with request [${pathname}]. ${
          error ? error : ""
        }`
      );
    }

    socket.write(
      `${reqJSON["reqHttpVersion"]} ${HTTP_STATUS_CODES[200].code} ${HTTP_STATUS_CODES[200].message}\r\n`
    );
    socket.write("Content-Type: text/html\r\n\r\n");
    const resBody = fs.createReadStream(TEMP_HTML_PATH);
    resBody.pipe(socket);
    resBody.on("end", () => {
      socket.end();
    });
  });
  socket.on("end", () => {
    console.log("client disconnected");
  });
});
server.on("error", (err) => {
  throw err;
});
server.listen(ALT_PORT, () => {
  console.log(`Server listening on port ${ALT_PORT}`);
});
