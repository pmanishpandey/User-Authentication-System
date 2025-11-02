import express, { Router } from 'express'
import User from '../Modeles/User.js';
import bcrypt from 'bcryptjs'

const authRouter=Router();
const Signup=async (req,res)=>{
    try{
        const {name,email,password ,about}=req.body
        const existingUser=await User.findOne({email})//check if the user alread existing
        if(existingUser){
            return res.status(400).json({message:"user already exist"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password ,salt) //hash password
    //create new user
   const newUser= new User({name,email,password:hashPassword,about})
   await newUser.save()
   res.status(201).json({message:"user created sucessfully"})
    }catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({message:"user not created", error: error.message});
}

}
const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"invalid email"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        const userData={
            id:user._id,
            name:user.name,
            email:user.email,
            about:user.about
        }
        res.json({message:"login sucessfully" ,user:userData})



    }catch(error){
        res.status(500).json({message:"login not sucess"})

    }
}
const AllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const OneUser = async (req, res) => {
    try {
        const { name, about } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, about },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};


authRouter.post("/signup" ,Signup)
authRouter.post("/login",login)
authRouter.get("/user",AllUser)
authRouter.put("/user/:id",OneUser)


export default authRouter