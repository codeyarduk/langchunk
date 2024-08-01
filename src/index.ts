#!/usr/bin/env ts-node

// import jsChunkDir from "./functions/languages/chunkFile";
import readDir from "./functions/readFiles/chunkDir";
import { argv } from "process";

import saveToken from "./functions/saveToken";
import authenticate from "./functions/authenticate";
import loadToken from "./functions/loadToken";

// import { select, Separator } from "@inquirer/prompts";
// Or
import select, { Separator } from "@inquirer/select";

// MAIN

const END_POINT_LOCAL = "http://localhost:8787";
const END_POINT_PROD = "https://api.heywilson.dev";

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
    // console.log(path);
    // console.log(data.dir_data[2].dir_data[0]);
    // console.log(data);

    // console.log("TOKEN", token);

    async function getProjects() {
      try {
        const projects = await fetch(`${END_POINT_PROD}/cli/workspaces`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        });

        if (projects.ok) {
          const projectData = await projects.json();
          // console.log(projectData);
          let choicesArr = [];
          for (let i = 0; i < projectData.length; i++) {
            choicesArr.push({
              name: projectData[i].workspaceName,
              value: projectData[i].workspaceId,
            });
          }

          const answer = await select({
            message:
              "Select the project that you want to link this directory to",
            choices: choicesArr,
          });
          return answer;
        } else {
          console.error("Failed to get projects. Error:", projects.statusText);
        }
      } catch (err) {
        console.log(err);
      }
      return null;
    }

    const workspaceId = await getProjects();

    // console.log(project);

    const data = await readDir(path);

    console.log(data);

    const response = await fetch(`${END_POINT_PROD}/cli/chunk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: JSON.stringify(data),
        token: token,
        workspaceId: workspaceId,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      // console.log("hello!");
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
// chmod +x dist/src/index.js
// npm link
