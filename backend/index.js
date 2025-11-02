import express from "express"
import cors from 'cors'
import mongoose from "mongoose"
import authRouter from "./Routes/auth.js"
import bodyParser from "body-parser"

const app=express()
app.use(cors())
app.use(bodyParser.json());
async function dbconnect(){
    try{
        await mongoose.connect("mongodb+srv://pmanishpandey3:manish8840@cluster0.zqzs9j7.mongodb.net/?appName=Cluster0");
    console.log("DB is connected");
    }catch(error){
        console.log("my error");
    }
}
dbconnect();
app.use("/api/auth",authRouter)

 
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
