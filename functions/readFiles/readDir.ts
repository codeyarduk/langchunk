import jsChunkDir from "../languages/jsChunkDir";
import fs from "fs";
import path from "path";

const processDirectory = async (directoryPath: string) => {
  const chunkedDir = [];

  const files = await fs.promises.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isFile() && path.extname(filePath) === ".ts") {
      const data = await jsChunkDir({ path: filePath });

      chunkedDir.push(data);
    }
  }

  return chunkedDir;
};

export default processDirectory;
