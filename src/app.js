require('dotenv').config
const express = require("express")
const path = require("node:path")

const app = express()
app.set("views", path.join(__dirname, "02_views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({ extended: false }));

app.listen(3000, (err) => {
  if (err) throw err
  console.log("App is listening to port: 3000")
})
