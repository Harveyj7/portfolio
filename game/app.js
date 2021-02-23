// Imports
require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

// Set View's
app.engine("handlebars", exphbs());
app.set("views", "./views");
app.set("view engine", "ejs");

// // Static folder
app.use(express.static("public"));
app.use("/css", express.static(__gidirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/images"));

// // Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Navigation
app.get("", (req, res) => {
  res.render("index");
});

app.get("/fyp", (req, res) => {
  res.render("fyp");
});
app.get("/matlab", (req, res) => {
  res.render("matlab");
});

app.get("/magnets", (req, res) => {
  res.render("magnets");
});
app.get("/tableau", (req, res) => {
  res.render("tableau");
});
app.get("/gbdp", (req, res) => {
  res.render("gbdp");
});
app.get("/game", (req, res) => {
  res.render("game");
});

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Your projects website" <your@email.com>', // sender address
    to: "harveyy7@gmail.com", // list of receivers
    subject: "CONTACT REQUEST", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // const message = { msg: "hey" };
    res.render("contact", { msg: "Email has been sent!" });
  });
});
app.get("/contact", (req, res) => {
  res.render("contact", { msg: "" });
});
app.listen(port, () => console.info(`App listening on port ${port}`));
