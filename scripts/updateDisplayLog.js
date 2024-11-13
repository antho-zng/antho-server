const fs = require("fs");
const path = require("path");
const os = require("os");

const TEMPLATE_PATH = path.resolve(
  __dirname,
  "..",
  "public",
  "index.template.html"
);
const TEMP_HTML_PATH = path.join(os.tmpdir(), `index-temp.html`);

const newLine = (text) => `<p>\n${text}\n</p>`;

const initializeDisplayLog = () => {
  try {
    const templateData = fs.readFileSync(TEMPLATE_PATH, "utf8");
    fs.writeFileSync(TEMP_HTML_PATH, templateData);
  } catch (error) {
    console.error(
      `Error initializing display log and creating temp HTML: ${error}`
    );
  }
};

const addLogEntry = (updatedHtml) => {
  try {
    fs.writeFileSync(TEMP_HTML_PATH, updatedHtml, "utf8");
  } catch (error) {
    console.error(`Error writing log entry to temp HTML: ${error}`);
  }
};

const updateDisplayLog = (newText) => {
  try {
    const data = fs.readFileSync(TEMP_HTML_PATH, "utf8");
    const updatedHtml = data.replace("<main>", `<main>\n${newLine(newText)}`);
    addLogEntry(updatedHtml);
  } catch (error) {
    console.error(`Error updating display log: ${error}`);
  }
};

const deleteTempHtmlFile = () => {
  try {
    if (fs.existsSync(TEMP_HTML_PATH)) {
      fs.unlinkSync(TEMP_HTML_PATH);
      console.log(`Temporary file ${TEMP_HTML_PATH} deleted on process exit.`);
    }
  } catch (error) {
    console.error(`Error deleting temporary file: ${error}`);
  }
};

process.on("exit", deleteTempHtmlFile);

process.on("SIGINT", () => {
  process.exit();
});

module.exports = { initializeDisplayLog, updateDisplayLog, TEMP_HTML_PATH };
