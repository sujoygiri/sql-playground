import expres, { NextFunction, Request, Response } from "express";
const server = expres();
const PORT:number = Number(process.env.PORT ?? 3000)

server.get("/",(req:Request, res:Response, next:NextFunction ) => {
    res.status(200).json({msg:"Hello from SQL play ground"})
})

server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})