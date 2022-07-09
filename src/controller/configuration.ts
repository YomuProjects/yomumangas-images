import cors from "cors";
import Express from "express";
import cache from "express-aggressive-cache";
import { existsSync, mkdirSync } from "fs";
import morgan from "morgan";
import path from "path";
import log from "../functions/log";
import middleware from "../functions/middleware";

const imagesRoutes = ["/avatars", "/banners", "/chapters", "/covers", "/images"];

export default function ({ app, routes }: Configuration) {

    /* ->> Ativando o propriedades do servidor <<- */
    app.use(cors())
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(morgan("dev"));

    /* ->> Verificando se a rota de imagens existe <<- */
    const mainPath = path.resolve(__dirname, "..", "..", "data");
    if (!existsSync(mainPath)) mkdirSync(mainPath);

    /* ->> Verificando se a rota de imagens temporárias existe <<- */
    const tempPath = path.resolve(__dirname, "..", "..", "tmp");
    if (!existsSync(tempPath)) mkdirSync(tempPath);
    imagesRoutes.forEach(route => {
        const routePath = path.join(tempPath, route.replace(/\//g, ""));
        if (!existsSync(routePath)) mkdirSync(routePath);
    });

    /* ->> Ativando o servidor de imagens <<- */
    imagesRoutes.forEach(route => {
        const routePath = path.resolve(mainPath, route.replace(/\//g, ""));
        if (!existsSync(routePath))
            mkdirSync(routePath);

        app.use(route, cache().middleware, Express.static(routePath));
    });

    /* ->> Ativando as demais rotas <<- */
    routes.map((rawRoute) => {
        try {
            const route = rawRoute.split(".")

            if (!["js", "ts"].includes(route[1])) return;

            const file = require(`../routes/${route[0]}`);
            app.use(`/${route[0]}`, middleware, file.default);
            log(2, `/${route[0]}`, "OK")
        } catch (err) {
            console.log(err)
            log(2, `/${rawRoute.split(".")[0]}`, "ERR")
        }
    });

    log(0)
};

interface Configuration {
    app: Express.Express;
    routes: string[];
};