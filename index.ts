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

(async () => {
  const path = argv[2]; // Get the directory path from the command-line arguments
  if (path) {
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
