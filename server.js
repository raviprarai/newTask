const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const { connect } = require("./database/db");
dotenv.config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
connect();

app.use("/api/User", require("./router/userRouter"));
app.use("/api/Project", require("./router/projectRouter"));
app.use("/api/Task", require("./router/taskRouter"));

app.get("/", (req, res) => {
  res.send("<h1>A Node Js API is listening on port:3000</h1>");
})

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));