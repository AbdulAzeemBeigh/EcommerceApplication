const mongoose = require("mongoose");
const server = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config.env" });

const DB = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(DB).then(() => {
  console.log("Database Connected ✅");
});

server.listen(PORT, () => {
  console.log(`Server is Listening at port ${PORT} `);
});
