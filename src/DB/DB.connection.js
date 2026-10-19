import chalk from "chalk";
import mongoose from "mongoose";

export const tryconnection = async()=>{
    if (!process.env.DB_URL) {
        throw new Error("DB_URL is required to connect to MongoDB");
    }

    try {
        await mongoose.connect(process.env.DB_URL)
        console.log(chalk.green("DBconnection"))
    } catch (error) {
        console.error(chalk.red("in-validConnection!!"), error)
        throw error
    }
}