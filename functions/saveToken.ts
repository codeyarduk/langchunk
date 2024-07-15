import fs from "fs";
import path from "path";

// SAVE THE TOKEN TO THE .wilson-config.json FILE

async function saveToken(token: any) {
  const configPath = path.join(__dirname, ".wilson-config.json");
  const config = token ? { token } : {};
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Token saved to ${configPath}`);
}

export default saveToken;