import { generateDefault } from "../src/generator";

const username = generateDefault({ sep: "" }, "test");
console.log(username);
