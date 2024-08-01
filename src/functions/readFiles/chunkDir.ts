import chunkFile from "./chunkFile";
import fs from "fs";
import path from "path";
import * as data from "./languages.json";
import ignore from "ignore";

const processDirectory = async (directoryPath: string): Promise<any[]> => {
  const chunkedFiles: any[] = [];
  const configPath = path.join(__dirname, "languages.json");
  let languageNodes: any;
  if (fs.existsSync(configPath)) {
    languageNodes = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
  const allowedFileExtensions = [".js", ".ts", ".tsx", ".jsx"];

  // Read .gitignore file
  const gitignorePath = path.join(directoryPath, ".gitignore");
  const ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, "utf8");
    ig.add(gitignoreContent);
  }

  const isIgnored = (filePath: string): boolean => {
    const relativePath = path.relative(directoryPath, filePath);
    return ig.ignores(relativePath);
  };

  const processFile = async (filePath: string) => {
    try {
      if (isIgnored(filePath)) {
        return;
      }

      const stats = await fs.promises.stat(filePath);
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);

      if (stats.isDirectory()) {
        const subDirFiles = await processDirectory(filePath);
        chunkedFiles.push(...subDirFiles);
      } else if (
        stats.isFile() &&
        allowedFileExtensions.includes(fileExtension) &&
        !fileName.startsWith(".")
      ) {
        let nodesForChunking;
        if (fileExtension === ".ts" || fileExtension === ".js") {
          nodesForChunking = languageNodes.javascript;
        } else if (fileExtension === ".tsx") {
          nodesForChunking = languageNodes.tsx;
        } else if (fileExtension === ".jsx") {
          nodesForChunking = languageNodes.tsx;
        }

        const data = await chunkFile({
          path: filePath,
          languageNodes: nodesForChunking,
        });

        chunkedFiles.push({
          file_path: filePath,
          data_chunks: data,
        });
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  };

  const files = await fs.promises.readdir(directoryPath);
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    await processFile(filePath);
  }

  return chunkedFiles;
};

export default processDirectory;
