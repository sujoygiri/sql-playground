import express, { NextFunction, Request, Response } from "express";
import { setTimeout } from "timers";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({debug: true});

import { queryRouter } from "./routes/query.route";
import userRouter from "./routes/user.route";
import { createUserDataTable } from "./db/init.table";
import { errorHandler } from "./utils/errorHandler.util";
import { removeData } from "./utils/global.util";

const server = express();
const PORT: number = process.env.NODE_ENV === "development" ? 3000 : Number(process.env.PORT)

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: "_ssid",
}))

server.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ msg: "Hello from SQL play ground" })
})
server.use("/query", queryRouter);
server.use("/user", userRouter);
server.use(errorHandler);

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await createUserDataTable();
    setTimeout(removeData, 1 * 60 * 60 * 1000);
})