import { cyan, green, magenta, red, yellow } from "colors";

console.log(green(`[${magenta("!")}] ${"=".repeat(60)} [${magenta("!")}]`));
console.log(green(`[${magenta("!")}] ${" ".repeat(22) + cyan("YomuMangás - API") + " ".repeat(22)} [${magenta("!")}]`));
console.log(green(`[${magenta("!")}] ${"=".repeat(60)} [${magenta("!")}]`));

export default function (type: number, message?: string, status?: "OK" | "ERR") {
    switch (type) {
        case 0: console.log(green(`[${magenta("!")}] ${"=".repeat(60)} [${magenta("!")}]`)); break;
        case 1: console.log(green(`[${magenta("!")}] ${yellow(`Ativando ${red(message || "sistema")}...`.padEnd(65, " "))} ${green("OK! ")} [${magenta("!")}]`)); break;
        case 2: console.log(green(`[${magenta("!")}] ${yellow(`Ativando rota ${red(message || "sistema")}...`.padEnd(65, " "))} ${status === "OK" ? green("OK! ") : red("ERR!")} [${magenta("!")}]`)); break;
    }
}