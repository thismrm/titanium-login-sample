const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.set("view engine", "ejs");

app.use((req, res, next) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, "jwt super secret key");
    app.locals.token = decoded;
  } catch (error) {
    console.log(error);
  }
  next();
});

function useAuth(req, res, next) {
  if (!app.locals.token) {
    res.render("login.ejs");
  }
  next();
}

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/", useAuth, (req, res) => {
  res.render("index.ejs", { token: app.locals.token });
});

app.get("/verify/:token", (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, "jwt super secret key");
    app.locals.token = decoded;
    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    res.send(error);
  }
});

app.get("/logout", (req, res) => {
  app.locals.token = "";
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(port, function () {
  console.log("titanium start");
});
