import { generateDefault } from "../src";

const username = generateDefault({ sep: "-", case: "upper" });
console.log(username);
