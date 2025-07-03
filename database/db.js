const mongoose = require("mongoose");


mongoose.set("strictQuery", false);

exports.connect = () => {
  mongoose
     .connect("mongodb+srv://admin:admin@cluster0.8qjsb.mongodb.net/newTaskApi")
    .then(() => console.log("Database Connected Successfully...."))
    .catch((err) => console.log(`DB connection error: ${err.message}`));

  mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
  });
};