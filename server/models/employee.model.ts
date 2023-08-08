import mongoose from 'mongoose';

const Employees = new mongoose.Schema({
    name: { type: String },
    department: { type: String},
    designation: { type: String },
    salary: { type: Number},
    joinDate: { type: Date},
    image: { type: String},
    citizenship: { type: String},

}, { collection: "employee-data" })

const noteModel = mongoose.model("EmployeeData", Employees)

module.exports = noteModel