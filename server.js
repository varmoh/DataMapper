import express from "express";
import { create } from "express-handlebars";

import * as fs from "node:fs";
import * as path from "path";
import { fileURLToPath } from "url";
import sendMockEmail from "./js/email/sendMockEmail.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 3100;
const app = express();
const hbs = create({});
app.use(express.json());

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/hbs/*", (req, res) => {
  res.render(req.params[0]);
});

app.get("/js/*", (req, res) => {
  res.send(fs.readFileSync(__dirname + req.path + ".js").toString());
});

app.post("/js/email/*", (req, res) => {
  const { to, subject, text } = req.body;
  try {
    sendMockEmail(to, subject, text);
    res.send(`email sent to: ${to}`);
  } catch (err) {
    res.errored(err);
  }
});

app.listen(PORT, () => {
  console.log("Nodejs server running on http://localhost:%s", PORT);
});
