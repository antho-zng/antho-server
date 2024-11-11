const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * steps:
 * initialize: read index.html, take content, put it into temp html
 * call updateDisplayLog() on temp html file
 * call cleanup function on exit
 */
const indexHtmlFilePath = path.resolve(
  __dirname,
  "..",
  "public",
  "index.template.html"
);
const tempHtmlPath = path.join(os.tmpdir(), `index-temp.html`);
console.log({ tempHtmlPath });

const newLine = (newText) => {
  return `<p>\n${newText}\n</p>`;
};

const initializeDisplayLog = () => {
  fs.readFile(indexHtmlFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    fs.writeFileSync(tempHtmlPath, data);
  });
};

const addLogEntry = (updatedHtml) => {
  fs.writeFile(tempHtmlPath, updatedHtml, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log("New paragraph added successfully.");
  });
};

const updateDisplayLog = (newText) => {
  fs.readFile(tempHtmlPath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    const updatedHtml = data.replace("<main>", `<main>\n${newLine(newText)}`);
    addLogEntry(updatedHtml);
  });
};

process.on("exit", () => {
  try {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
      console.log(`Temporary file ${tempHtmlPath} deleted on process exit.`);
    }
  } catch (error) {
    console.error(`Error deletig temporary file: ${error}`);
  }
});

// Optionally handle other exit signals like SIGINT (Ctrl+C) for manual exits
process.on("SIGINT", () => {
  process.exit();
});

module.exports = { initializeDisplayLog, updateDisplayLog, tempHtmlPath };
