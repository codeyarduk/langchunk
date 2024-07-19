import chunkFile from "./chunkFile";
import fs from "fs";
import path from "path";
import * as data from "./languages.json";

const processDirectory = async (directoryPath: string) => {
  const chunkedDir = [];

  const configPath = path.join(__dirname, "languages.json");
  // console.log("PATH", configPath);
  let languageNodes;
  if (fs.existsSync(configPath)) {
    languageNodes = JSON.parse(fs.readFileSync(configPath, "utf8"));
    // return config.token;
    // console.log("language nodes:", languageNodes);
  }

  // console.log(languageNodes);

  const files = await fs.promises.readdir(directoryPath);

  const allowedFileExtentions = [".js", ".go", ".ts"];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);
    let isDotFile = false;
    let nodesForChunking;

    if (file[0] === ".") {
      isDotFile = true;
    }

    if (
      stats.isFile() &&
      allowedFileExtentions.includes(path.extname(filePath)) &&
      !isDotFile
    ) {
      if (path.extname(filePath) === ".go") {
        nodesForChunking = languageNodes.go;
      } else if (path.extname(filePath) === ".ts") {
        nodesForChunking = languageNodes.javascript;
      } else if (path.extname(filePath) === ".js") {
        nodesForChunking = languageNodes.javascript;
      }
      const data = await chunkFile({
        path: filePath,
        languageNodes: nodesForChunking,
      });
      // console.log("hi");

      chunkedDir.push(data);
      console.log("DATA: ", data);
    }
  }

  const chunkDirObject = {
    dir_path: directoryPath,
    dir_data: chunkedDir,
  };

  return chunkDirObject;
};

export default processDirectory;
