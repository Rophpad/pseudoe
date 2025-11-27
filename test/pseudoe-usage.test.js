const { pseudoe } = require("../dist/index");

const pseudo = new pseudoe({ sep: "", case: "upper" });

const username = pseudo.default();
console.log(username);

const africanUsername = pseudo.style("fruits");
console.log(africanUsername);

const randomUsername = pseudo.random("fruits", "galaxy");
console.log(randomUsername);
