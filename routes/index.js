const express = require("express");
const app = express()

app.use("/auth", require("../controllers/auth"))

app.use("/users", require("./users"))

app.use("/categories", require("./categories"))

app.use("/products", require("./products"))

app.use("/stocks", require("./stocks"))

app.use("/customers", require("./customers"))

app.use("/suppliers", require("./suppliers"))

module.exports = app