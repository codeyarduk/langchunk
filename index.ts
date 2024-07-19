#!/usr/bin/env ts-node

// import jsChunkDir from "./functions/languages/chunkFile";
import readDir from "./functions/readFiles/chunkDir";
import { argv } from "process";

import saveToken from "./functions/saveToken";
import authenticate from "./functions/authenticate";
import loadToken from "./functions/loadToken";

// MAIN

(async () => {
  const path = argv[2]; // Get the directory path from the command-line arguments
  if (path) {
    // CHECK IF USER IS LOGGED IN
    let token = await loadToken();

    if (!token) {
      console.log(
        "Please login to your Wilson account in the browser to continue!"
      );
      token = await authenticate();

      if (token) {
        await saveToken(token);
      } else {
        console.error("Failed to login in.");
        process.exit(1);
      }
    }
    // READ FILES FROM DIRECTORY
    const data = await readDir(path);
    // console.log(path);
    console.log(data);

    const response = await fetch("https://api.wilson.codeyard.co.uk/chunk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: JSON.stringify(data), token: token }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error(
        "Failed to send data to server. Error:",
        response.statusText
      );
    }
  } else {
    console.log("Please provide a directory path.");
  }
})();

// npm run build
// chmod +x dist/index.js
// npm link
