import fs from "fs";
import path from "path";

async function loadToken() {
  const configPath = path.join(__dirname, ".wilson-config.json");
  // console.log(configPath);
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config.token;
  }
  return null;
}

export default loadToken;
