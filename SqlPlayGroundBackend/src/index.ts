import express, { NextFunction, Request, Response } from "express";
import cors from "cors"

import { queryRouter } from "./routes/query.route";

const server = express();
const PORT:number = process.env.NODE_ENV === "development" ? 3000 : Number(process.env.PORT)

server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
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