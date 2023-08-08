const Employee = require("../models/employee.model")
require('dotenv').config();
import express, { Request, Response } from "express";
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const filePath = file.fieldname + '-' + uniqueSuffix + extension;
        cb(null, filePath);
    }
});

const upload = multer({ storage: storage });

router.post("/employee/create", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'citizenship', maxCount: 1 }]), async (req: Request, res: Response) => {
    if (!req.body.name || !req.body.department || !req.body.designation || !req.body.salary) {
        return res.json({ status: "error", message: "Required field is empty" });
    }

    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const imageFile = files["image"];
        const citizenshipFile = files["citizenship"];

        const image = imageFile ? "uploads/" + imageFile[0].filename : undefined;
        const citizenship = citizenshipFile ? "uploads/" + citizenshipFile[0].filename : undefined;

        await Employee.create({
            name: req.body.name,
            department: req.body.department,
            designation: req.body.designation,
            salary: req.body.salary,
            image: image,
            citizenship: citizenship,
        });

        const employees = await Employee.find({});
        return res.json({ status: "success", message: "The employee has been added", data: employees });
    } catch (err) {
        return res.json({ status: "error", message: "There was an error" });
    }
});

router.patch("/employee/edit/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'citizenship', maxCount: 1 }]), async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const updatedEmployeeData: {name: string, department: string, designation: string, salary: string, image?: string, citizenship?: string} = {
            name: req.body.name,
            department: req.body.department,
            designation: req.body.designation,
            salary: req.body.salary,
        };

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files["image"]) {
            updatedEmployeeData.image = "uploads/" + files["image"][0].filename;
        }
        if (files["citizenship"]) {
            updatedEmployeeData.citizenship = "uploads/" + files["citizenship"][0].filename;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedEmployeeData, { new: true });

        if (!updatedEmployee) {
            return res.json({ status: "error", message: "Employee not found" });
        }

        return res.json({ status: "success", message: "Employee updated", data: updatedEmployee });
    } catch (err) {
        return res.json({ status: "error", message: "There was an error" });
    }
});


router.get("/getemployeeinfo", async (req, res) => {
    try {
        const employee = await Employee.find({})
        return res.json({ status: "success", data: employee })
    } catch (err) {
        return res.json({ status: "error", message: "There is an error" })
    }

})


router.delete("/employee/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const employee = await Employee.findByIdAndDelete(id)
        return res.json({ status: "success", message: "The note has been deleted" })
    } catch (err) {
        return res.json({ status: "error", message: "There is an error" })
    }
})




module.exports = router