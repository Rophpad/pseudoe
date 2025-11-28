const { pseudoe } = require("../dist/index");

const pseudo = new pseudoe({ sep: "", case: "upper" });

const username = pseudo.default();
// PSEUDOE355

const fruitUsername = pseudo.style("fruits");
// SWEETFIG386

pseudo.options({ sep: "-", case: "lower" });

const africanUsername = pseudo.style("african");
// zola-ashanti-489
