require('dotenv').config();
import express from 'express';
const app = express()
const mongoose = require("mongoose")
const cors = require("cors");
const employee = require("./routes/Employee")
const user = require("./routes/User")
const path = require("path")

app.use(cors());

app.get('/', (req, res) => {
    res.send('Running');
});


app.use(express.json({ limit: "50mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

mongoose.connect(process.env.mongo_URI, {
    useNewUrlParser: true,
})

app.use("/api", employee)
app.use("/api", user)


app.listen(1447, () => {
    console.log('Server started on 1447')
})