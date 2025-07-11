import express, { NextFunction, Request, Response } from "express";
import { queryRouter } from "./routes/query.route";
const server = express();
const PORT:number = Number(process.env.PORT ?? 3000)

server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.get("/",(req:Request, res:Response, next:NextFunction ) => {
    res.status(200).json({msg:"Hello from SQL play ground"})
})
server.use("/query", queryRouter)

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})