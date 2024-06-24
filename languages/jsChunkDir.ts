import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

// Type declarations
interface jsChunkDirParams {
  path?: string;
  code: string;
}

interface findChunksParams {
  // node: Parser.Tree;
  node: any;
  code: string;
}

const jsChunkDir = ({ path, code }: jsChunkDirParams) => {
  // const language = "js";
  const parser = new Parser();
  parser.setLanguage(JavaScript);
  const tree = parser.parse(code);
  // console.log((tree as any).input);
  if (!tree) {
    console.log("Failed to parse the code");
  }

  return findChunks({ node: tree, code: (tree as any).input });
};

const findChunks = ({ node, code }: findChunksParams) => {
  // Recursive function to log node details and its children
  // console.log(code);
  const MAX_CHUNK_SIZE: number = 1000;
  const logNodeDetails = (node: any, depth: number = 0) => {
    // Log the current node's details
    console.log(node.type, node.startPosition, node.endPosition);
    if (node.type === "import_statement") {
      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      const importStatement = code
        .split("\n")
        .slice(startPosition.row, endPosition.row + 1);
      const importCode = importStatement.join("\n");

      // console.log("Import:", importCode);
    }

    if (node.type === "lexical_declaration") {
      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      const importStatement = code
        .split("\n")
        .slice(startPosition.row, endPosition.row + 1);
      const importCode = importStatement.join("\n");

      // console.log("Declaration:", importCode);
    }

    if (node.type === "class_declaration") {
      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      const classLines = code
        .split("\n")
        .slice(startPosition.row, endPosition.row + 1);
      const classCode = classLines.join("\n");

      // console.log("Class:", classCode);
    }

    if (node.type === "arrow_function") {
      const startPosition = node.startPosition;
      const endPosition = node.endPosition;
      // console.log(node);
      const classLines = code
        .split("\n")
        .slice(startPosition.row, endPosition.row + 1);
      const classCode = classLines.join("\n");

      // console.log("Arrow Function:", classCode);
    }

    // Iterate through each child of the node
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      // console.log(depth);
      if (depth < 6) {
        logNodeDetails(child, depth + 1); // Recursively log details for each child
      }
    }
  };

  // Start logging from the root node
  logNodeDetails(node.rootNode);
  // return node.rootNode;
};

const getChunks = () => {};

jsChunkDir({
  code: ` 
  // import y from "hello";
  // console.log("it's a good day!");

  // const myFunc = () => {
  //   return "Hello world!";
  //   const myTwo = 'Hi two?';
  // }

  // class MyClass {
  //   const myFunc2 = () => {
  //     return "Hello world!";
  //     const myTwo = 'Hi two?';
  //   }

  //   const myFunc3 = () => {
  //     return "Hello world!";
  //     const myTwo = 'Hi two?';
  //   }
  // }

import React from "react";
import DescTag from "../components/DescTag";

function SystemSupport() {
  return (
    <div
      id="services"
      className="py-10 xl:py-20 w-full max-w-[1156px] flex flex-col lg:items-center"
    >
      <h5 className="max-w-[700px] font-bold text-2xl lg:text-[36px] lg:leading-10 lg:text-center leading-7 pb-4 lg:pb-6">
        Our Services
      </h5>
      <div className="flex flex-wrap mb-4 lg:mb-10 max-w-[900px] lg:justify-center">
        <DescTag title="Visual Design" />
        <DescTag title="Wireframes" />
        <DescTag title="High-Fidelity Mockups" />
        <DescTag title="Interactive Prototypes" />
        <DescTag title="Responsive Layouts" />
        <DescTag title="Mobile Apps" />
        <DescTag title="Building Component Libraries" />
        <DescTag title="Maintaining Component Libraries" />
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:justify-between max-w-[1156px]">
        <img
          src="../../work-examples/example-one.svg"
          className="mb-6 w-full sm:w-[32%] object-cover"
          draggable="false"
          alt="website landing page in dark"
        />
        <img
          src="../../work-examples/example-two.svg"
          className="mb-6 w-full sm:w-[32%] object-cover"
          draggable="false"
          alt="website landing page in dark"
        />
        <img
          src="../../work-examples/example-three.svg"
          className="mb-6 w-full sm:w-[32%] object-cover"
          draggable="false"
          alt="website landing page in dark"
        />
      </div>
      <a
        href="https://www.figma.com/proto/YZ7mEOEg9pkIn8xbNI7xwy/Orin-Landing-Page?page-id=1068%3A6441&node-id=1068-6666&viewport=380%2C416%2C0.12&t=eeaTGHglfrxyoGPP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1068%3A6666&show-proto-sidebar=1"
        target="_blank"
      >
        <button className="px-6 leading-[14px] border-[1.4px] py-4 rounded-lg border-orin-black hover:bg-[#EFEFEF] active:bg-[#E0DCDC]">
          View More Work
        </button>
      </a>
    </div>
  );
}

const myEssay = '';

export default SystemSupport;
  

  // class MyClass2 {
  //   myMethod() {
  //     return "Hello world!";
  //   }
   
  //   import y from "hello";

  // }  
  `,
});

export default jsChunkDir;
