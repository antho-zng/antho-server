const { updateDisplayLog } = require("./displayService");
const serverCache = new Map();

const handleSetRequest = (searchParams) => {
  const [[key, value]] = searchParams.entries();
  serverCache.set(key, value);
  updateDisplayLog(
    `${new Date()} -- SET: VALUE [${value}] stored at KEY [${key}]`
  );
};

const handleGetRequest = (searchParams) => {
  const key = searchParams.get("key");
  const value = serverCache.get(key);

  if (value === undefined) {
    throw new Error("The requested key was not found.");
  }
  updateDisplayLog(
    `${new Date()} -- GET: The requested VALUE stored at KEY [${key}] is [${value}]`
  );
};

module.exports = { serverCache, handleSetRequest, handleGetRequest };
