#!/usr/bin/env node

// import fs from "fs";
// import path from "path";
// import { Command } from "commander";
// const program = new Command();

import jsChunkDir from "./languages/jsChunkDir";
import jsChunkFile from "./languages/jsChunkFile";

// program
//   .version("1.0.0")
//   .arguments("<directory>")
//   .description("Chunk JavaScript files in a directory")
//   .action(async (directory: string) => {
//     console.log(`Chunking files in directory: ${directory}`);
//   });

// program.parse(process.argv);

export { jsChunkDir, jsChunkFile };

// Checking if rebase worked
