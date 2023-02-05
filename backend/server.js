if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const commentsRoutes = require("./routes/comments.js");
require("dotenv").config();

const app = express();

// middleware
app.use(express.json()); // any request that comes in, checks to see if it has some body/data, and if it does, parse and attach it to the req parameter
app.use(cors());
app.use((req, res, next) => {
  // fires for every request that comes in
  console.log(req.path, req.method);
  next();
});

// app.use("/api/comments", commentsRoutes);
app.use("/comments", require(path.join(__dirname, "routes", "comments.js")));

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // remove poolSize or set according to your need
    // read docs before setting poolSize
    // default to 5
    //poolSize: 1,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to db and listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// static files (build of your frontend)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
