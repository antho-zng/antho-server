const http = require("http");
const path = require("node:path");
const fs = require("node:fs");
const { PORT, REQUEST_ACTIONS } = require("./constants");
const {
  initializeDisplayLog,
  updateDisplayLog,
  TEMP_HTML_PATH,
} = require("./scripts/updateDisplayLog");

const { SET, GET } = REQUEST_ACTIONS;
const serverMemory = new Map();

/**
 * This creates a temporary file that we'll use to log and display server requests.
 * The file will be deleted on exit
 */
initializeDisplayLog();

const server = http.createServer((req, res) => {
  /**
   * We're using a URL constructor here for (1) better readability/maintainability
   * (string manipulation methods would be kinda hacky) and (2) ease of accessing
   * `pathname` and `searchParams`
   */
  const urlBase = `http://${req.headers.host}`;
  const { pathname, searchParams } = new URL(req.url, urlBase);

  try {
    switch (pathname) {
      case SET:
        const [[key, value]] = searchParams.entries();
        serverMemory.set(key, value);
        updateDisplayLog(
          `${new Date()} -- SET: VALUE [${value}] stored at KEY [${key}]`
        );
        break;
      case GET:
        const reqKey = searchParams.get("key");
        const resValue = serverMemory.get(reqKey);
        if (resValue === undefined) {
          throw new Error("The requested key was not found.");
        } else {
          updateDisplayLog(
            `${new Date()} -- GET: The requested VALUE stored at KEY [${reqKey}] is [${resValue}]`
          );
        }
        break;
      default:
        break;
    }
  } catch (error) {
    updateDisplayLog(
      `${new Date()} -- Error with request [${pathname}]. ${error ? error : ""}`
    );
  }
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(path.resolve(__dirname, TEMP_HTML_PATH)).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
