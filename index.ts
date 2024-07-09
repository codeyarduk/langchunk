#!/usr/bin/env ts-node

import jsChunkDir from "./functions/languages/jsChunkDir";
import jsChunkFile from "./functions/languages/jsChunkFile";
import readFile from "./functions/readFiles/readFile";
import readDir from "./functions/readFiles/readDir";
import { argv } from "process";

// requires

import http from "http";
import url from "url";
import open from "open";
import fs from "fs";
import path from "path";

// LOCAL SERVER TO RECEIVE TOKEN

function startLocalServer(port = 8000) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse((req as any).url, true);
      const token = parsedUrl.query.token;

      res.writeHead(200, { "Content-Type": "text/html" });

      if (token) {
        res.end("Authentication successful! You can close this window.");
        server.close(() => resolve(token));
      } else {
        res.end("No token received. Please try again.");
      }
    });

    server.listen(port, (err: void) => {
      if (err as any) {
        reject(err);
      } else {
        console.log(`Server started at http://localhost:${port}`);
      }
    });
  });
}

// AUTHENTICATE AT WILSON

async function authenticate() {
  const port = 8000;
  const authUrl = `https://auth.codeyard.co.uk/login?port=${port}`;

  try {
    const serverPromise = startLocalServer(port);
    await open(authUrl);
    const token = await serverPromise;

    if (token) {
      console.log(`Received token: ${token}`);
      return token;
    } else {
      console.log("Authentication failed");
      return null;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

// SAVE THE TOKEN TO THE .wilson-config.json FILE

async function saveToken(token: any) {
  const configPath = path.join(process.cwd(), ".wilson-config.json");
  const config = { token };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Token saved to ${configPath}`);
}

// LOAD THE TOKEN FROM THE .wilson-config.json FILE

async function loadToken() {
  const configPath = path.join(process.cwd(), ".wilson-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config.token;
  }
  return null;
}

// MAIN

(async () => {
  const path = argv[2]; // Get the directory path from the command-line arguments
  if (path) {
    // CHECK IF USER IS LOGGED IN
    let token = await loadToken();
    if (!token) {
      console.log(
        "No existing token found. Starting authentication process..."
      );
      token = await authenticate();

      if (token) {
        await saveToken(token);
      } else {
        console.error("Failed to obtain token. Exiting.");
        process.exit(1);
      }
    }
    // READ FILES FROM DIRECTORY
    const data = await readDir(path);
    // console.log(data);
    // SEND DATA TO RABBITCODE SERVER

    const response = await fetch("http://localhost:8787/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    console.log(responseBody);
  } else {
    console.log("Please provide a directory path.");
  }
})();

export { jsChunkDir, jsChunkFile };
// npm run build
// chmod +x dist/index.js
// npm link
