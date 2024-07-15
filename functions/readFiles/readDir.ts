import chunkFile from "../languages/chunkFile";
import fs from "fs";
import path from "path";

const processDirectory = async (directoryPath: string) => {
  const chunkedDir = [];
  const uniqueData = new Set();
  // const languages = fs.readFileSync("languages.json").toString();
  // const languageNodes = JSON.parse(languages);

  const files = await fs.promises.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile() && path.extname(filePath) === ".js") {
      const data = await chunkFile({
        path: filePath,
        // languageNodes: languageNodes.javascript,
      });

      // console.log("DATA:", data);

      if (!uniqueData.has(data)) {
        uniqueData.add(data);
        chunkedDir.push(data);
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
