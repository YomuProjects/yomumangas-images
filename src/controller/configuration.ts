import Express from "express";
import { existsSync, mkdirSync } from "fs";
import morgan from "morgan";
import path from "path";
import log from "../functions/log";

export default function ({ app, routes }: Configuration) {

    /* ->> Ativando o propriedades do servidor <<- */
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    /* ->> Verificando se a rota de imagens existe <<- */
    if (!existsSync(path.resolve(__dirname, "..", "..", "images")))
        mkdirSync(path.resolve(__dirname, "..", "..", "images"));

    /* ->> Ativando o servidor de imagens <<- */
    app.use("/", Express.static(path.resolve(__dirname, "..", "..", "images")));

    /* ->> Ativando as demais rotas <<- */
    routes.map((rawRoute) => {
        const routeAndExtension = rawRoute.split(".")
        const extension = routeAndExtension[1];
        const route = routeAndExtension[0];

        if (!["js", "ts"].includes(extension)) return;

        try {
            const file = require(`../routes/${route}`)

            app.use(`/${route}`, file.default);

            log(2, `/${route}`, "OK")
        } catch (err) {
            console.log(err)
            log(2, `/${route}`, "ERR")
        }
    });

    log(0)
};

interface Configuration {
    app: Express.Express;
    routes: string[];
};