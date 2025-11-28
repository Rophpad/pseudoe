import { pseudoe } from "../dist";

const pseudo = new pseudoe({ sep: "", case: "upper" });

const username = pseudo.default();
// PSEUDOE355

const fruitUsername = pseudo.style("fruits");
// SWEETFIG386

pseudo.options({ sep: "-", case: "lower" });

const africanUsername = pseudo.style("african");
// sweetfig386
console.log(africanUsername);
