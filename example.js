// example.js
class ExampleClass {
  constructor() {
    this.name = "ExampleClass";
  }

  sayHello() {
    console.log("Hello from ExampleClass!");
  }
}

function exampleFunction() {
  console.log("This is a test function.");
}

const exampleObject = {
  key: "value",
  method() {
    console.log("Method in an object.");
  },
};

exampleFunction();
const exampleInstance = new ExampleClass();
exampleInstance.sayHello();
exampleObject.method();
