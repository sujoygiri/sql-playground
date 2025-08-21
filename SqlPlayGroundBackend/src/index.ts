import express, { NextFunction, Request, Response } from "express";
import cors from "cors"

import { queryRouter } from "./routes/query.route";

const server = express();
const PORT:number = Number(process.env.PORT ?? 3000)

server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use(cors({
    credentials: true,
    origin: ["https://4200-firebase-sql-playground-1752058990341.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev/"],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

server.get("/",(req:Request, res:Response, next:NextFunction ) => {
    res.status(200).json({msg:"Hello from SQL play ground"})
})
server.use("/query", queryRouter)

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})