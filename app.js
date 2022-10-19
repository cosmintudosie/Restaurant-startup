const express = require("express");
const mongo = require("mongodb");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const MongoClient = mongo.MongoClient;
const fileUpload = require("express-fileupload");

app.use(cors());

app.use(
  fileUpload({
    limits: {
      fileSize: 1000000,
    },
    abortOnLimit: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const port = process.env.PORT || 3000;
dotenv.config({ path: "./config.env" });

/////-----CREATE MONGO DB
const DB = process.env.DATABASE.replace(
  "PASSWORD",
  process.env.DATABASE_PASSWORD
);
const url = process.env.DATABASE;
let dbCatering;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});
////////--------FORM SUBMIT TO DATABASE------------

app.post("/formPost", (req, res) => {
  const newForm = req.body;

  console.log(newForm);
  ////////File upload/////////
  let image;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded or file too big.");
  }

  image = req.files.image;
  uploadPath = __dirname + "/img/" + image.name;

  image.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
  });
  newForm.imgSrc = uploadPath;

  ////DAILY MENU
  newForm.daily = false;
  dbCatering.collection("menu").insertOne(newForm, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });

  res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/populate", (req, res) => {
  dbCatering
    .collection("menu")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;

      res.send(result);
    });
});
app.delete("/deleteItem", (req, res) => {
  let delItem = { title: req.body.delItem };
  dbCatering.collection("menu").deleteOne(delItem, function (err, res) {
    if (err) throw err;
  });
  res.send("done");
});
app.delete("/deleteOrder", (req, res) => {
  let delOrder = { phone: req.body.delItem };
  dbCatering.collection("orders").deleteOne(delOrder, function (err, res) {
    if (err) throw err;
  });
  res.send("done");
});
app.patch("/updateItem", (req, res) => {
  let updateItem = { title: req.body.updateItem };
  let updatedValue = { $set: { daily: req.body.value } };
  console.log(req.body.updateItem);
  dbCatering
    .collection("menu")
    .updateOne(updateItem, updatedValue, function (err, res) {
      if (err) throw err;
      console.log(updateItem, updatedValue);
    });
  res.send("done");
});

app.post("/order", (req, res) => {
  const newOrder = req.body;

  dbCatering.collection("orders").insertOne(newOrder, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
});

app.get("/orderList", (req, res) => {
  dbCatering
    .collection("orders")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;

      res.send(result);
    });
});

app.listen(port, () =>
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbCatering = db.db("catering");
    console.log("Listening on port 3000");
  })
);
