import chalk from "chalk";
import express from "express";
import config from "dotenv";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { tryconnection } from "./DB/DB.connection.js";
import { router, routes } from "./model/user.model/user.conttroller.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

config.config({
    path: fileURLToPath(new URL("../.env", import.meta.url))
});

app.use(routes.base, router);

export const index = async () => {
    await tryconnection();

    app.listen(process.env.PORT || 3000, () => {
        console.log(chalk.green(`run in port ${process.env.PORT || 3000}`));
    });

    app.use((err, req, res, next) => {
        const statusCode = err.cause?.statusCode || 500;

        res.status(statusCode).json({
            errorMsg: err.message,
            status: statusCode,
            errorOptions: err.cause?.options
        });
    });
};