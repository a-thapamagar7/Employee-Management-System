require('dotenv').config();
import express, { Request, Response } from "express";
const User = require("../models/user.model")
const router = require("./Employee")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



router.post("/user/register", async (req: Request, res: Response) => {
    const { name, email, password }: { name: string; email: string; password: string } = req.body;


    if(!name || !email || !password) {
        return res.json({ status: "error", message: "The required field is empty" })
    }

    const user = await User.findOne({
        email: email
    })

    if(user) return res.json({status: "error", message: "This email already exists"})

    const newPassword = await bcrypt.hash(req.body.password, 10)
    try{
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        })
        return res.json({status: "success", message: "You have successfully registered"})
    }
    catch{
        return res.json({status: "success", message: "The registration has failed"})
    }


});

router.post("/user/login", async (req: Request, res: Response) =>{
    const {password, email} = req.body

    if(!password || !email) {
        return res.json({ status: "error", message: "The required field is empty" })
    }

    const user = await User.findOne({
        email: email
    })

    if(!user) return res.json({status: "error", message: "This email does not exist in our database"})

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if(isPasswordValid) {
        try{
            const token = jwt.sign({
                userID: user._id,
            }, process.env.secretKey)
            return res.json({ status: "success", message: "The user has successfully logged in", user: token, role: user.role  })
        }
        catch{
            return res.json({status: "error", message: "The login has failed"})
        }
    }
    else {
        return res.json({status: "error", message: "The password is incorrect"})
    }
})

router.get("/user/verify", async (req: Request, res: Response) =>{
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.secretKey);
        const userID = decodedToken.userID;
        const currentUser = await User.findById(userID).select("name email");
        return res.json({ status: "success", message: "The user has been found", data: currentUser })
    } catch (err) {
        return res.json({ status: "error", message: "There is an error" })
    }
})



module.exports = router