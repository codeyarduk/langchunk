import jsChunkDir from "../languages/jsChunkDir";
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
      const data = await jsChunkDir({
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

// data: '      const response = await fetch("https://rag.codeyard.co.uk/chunk", {\n' +
// '        method: "POST",\n' +
// '        headers: {\n' +
// '          "Content-Type": "application/json",\n' +
// '        },\n' +
// '        body: JSON.stringify({ data: JSON.stringify(data), token: token }),\n' +
// '      });',

// data: '      const response = await fetch("https://rag.codeyard.co.uk/chunk", {\n' +
// '        method: "POST",\n' +
// '        headers: {\n' +
// '          "Content-Type": "application/json",\n' +
// '        },\n' +
// '        body: JSON.stringify({ data: JSON.stringify(data), token: token }),\n' +
// '      });',
