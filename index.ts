#!/usr/bin/env node

// import fs from "fs";
// import path from "path";
// import { Command } from "commander";
// const program = new Command();

import jsChunkDir from "./functions/languages/jsChunkDir";
import jsChunkFile from "./functions/languages/jsChunkFile";
import readFile from "./functions/readFiles/readFile";
import readDir from "./functions/readFiles/readDir";

// program
//   .version("1.0.0")
//   .arguments("<directory>")
//   .description("Chunk JavaScript files in a directory")
//   .action(async (directory: string) => {
//     console.log(`Chunking files in directory: ${directory}`);
//   });

(async () => {
  const data = await readDir("./test_code/");
  console.log(data);
})();

// (async () => {
//   const data = await jsChunkDir({ path: "./test_code/test1.ts" });
//   console.log(data);
// })();

// program.parse(process.argv);

export { jsChunkDir, jsChunkFile };

// Checking if rebase worked
