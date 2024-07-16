import chunkFile from "../languages/chunkFile";
import fs from "fs";
import path from "path";
import * as data from "./languages.json";

const processDirectory = async (directoryPath: string) => {
  const chunkedDir = [];
  const uniqueData = new Set();

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

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);
    let isDotFile = false;

    if (file[0] === ".") {
      isDotFile = true;
    }

    if (stats.isFile() && path.extname(filePath) === ".js" && !isDotFile) {
      const data = await chunkFile({
        path: filePath,
        languageNodes: languageNodes.javascript,
      });

      if (!uniqueData.has(data)) {
        uniqueData.add(data);
        chunkedDir.push(data);
        console.log(data);
      }
    }
  }

  const chunkDirObject = {
    dir_path: directoryPath,
    dir_data: chunkedDir,
  };

  return chunkDirObject;
};

export default processDirectory;
