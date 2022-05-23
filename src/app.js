import express from "express";
import bodyParser from "body-parser";
import book from "./routes/book.js";
import category from "./routes/category.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const app = express();
const port = 3005;
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set Template Enging
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, "views")));
// console.log( path.join(__dirname, "views"));
app.set("view engine", "ejs");

//  Routes    //
app.get("/home", (req, res) => {
  res.render("home");
});
app.use("/", book);
app.use("/", category);

app.listen(port, () => {
  console.log(`Server is runing... ${port}`);
});
