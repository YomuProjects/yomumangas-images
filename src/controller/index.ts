/* ->> Definindo Imports <<- */
import { green, magenta, white } from "colors";
import { config } from "dotenv";
import express from "express";
import { readdirSync } from "fs";
import "../functions/log";
import log from "../functions/log";
import configuration from "./configuration";


const app = express();
const routes = readdirSync("src/routes");


/* ->> Executando Funções <<- */
config();
configuration({ app, routes });


/* ->> Iniciando servidor na rota <<- */
app.listen(process.env.PORT, () => {
    console.log(green(`[${magenta("!")}] ${green(`API ativada com sucesso na porta ${white(process.env.PORT)}`.padEnd(70, " "))} [${magenta("!")}]`));
    log(0);
})