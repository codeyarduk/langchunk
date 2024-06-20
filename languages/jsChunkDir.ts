import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

interface jsChunkDirParams {
  path?: string;
  code: string;
}

const jsChunkDir = ({ path, code }: jsChunkDirParams) => {
  // const language = "js";
  const parser = new Parser();
  parser.setLanguage(JavaScript);
  const tree = parser.parse(code);

  if (!tree) {
    console.log("Failed to parse the code");
  }

  return tree.rootNode.toString();
};

console.log(
  jsChunkDir({
    code: `
  
  import y from "hello";
  console.log("it's a good day!");

  const myFunc = () => {
    return "Hello world!";
  }
  
  `,
  })
);

export default jsChunkDir;
