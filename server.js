const express = require("express");
const cors = require("cors");
const app = express();

var env = process.env.NODE_ENV || "dev";
const config = require("./config")[env];
const db = require("./database");

const userRoutes = require("./routes/user.routes");
const planRoutes = require("./routes/plan.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRoutes);
app.use("/api", planRoutes);

app.get("/", async (req, res) => {
  await db.authenticate();
  res.send("Welcome!");
});

app.listen(config.server.port);
