// Files importing
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//--------------------------------------------DATABASE--------------------------------------------//

// Connecting a database
async function connect() {
  try {
    const databaseObj = await mongoose.connect("mongodb://127.0.0.1/27017", {
      dbName: "selfDataBase",
    });
    console.log(`Database connected at : ${databaseObj.connection.port}`);
  } catch (error) {
    console.log(error);
  }
}
connect();

// Creating a schema Model
const user_Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Creating a Model
const user_Model = mongoose.model("user_Model", user_Schema);

//--------------------------------------------DATABASE-END --------------------------------------------//

const app = express();
// EJS Configure
app.set("view engine", "ejs");

// Static files setup
app.use(express.static("./public"));

// Post Method Data Configure
app.use(express.urlencoded({ extended: true }));

// Cookie parser setup
app.use(cookieParser());

// GET ROUTES
const isAuthendicated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decodedData = jwt.verify(token, "qwertyuiop");
    req.user = await user_Model.findOne({ _id: decodedData.id });
    next();
  } else {
    res.redirect("/login");
  }
};
// Index Route
app.get("/", isAuthendicated, (req, res) => {
  console.log(req.user);
  res.render("logout", { name: req.user.username });
});
// Login Get Route
app.get("/login", (req, res) => {
  res.render("login");
});

// Logout Route
// Only when the logout button of the logout page is clicked , this gets triggered
app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

// Register ko Get route
app.get("/register", (req, res) => {
  res.render("register");
});

// POST ROUTES
app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await user_Model.findOne({ email: email });

  if (!user) {
    res.redirect("/register");
    return;
  }

  const isMatch = await bcrypt.compare(password,user.password)
  if (!isMatch) {
    return res.render("login", {
      username,
      email,
      message: "Incorrect Password",
    });
  }

  // Database user ko id represent garcha , from the returned token of jwt.sign()
  const JSONToken = jwt.sign({ id: user._id }, "qwertyuiop");
  // yoh "JSONToken" leh database ko user ko id lai represent garcha hai

  res.cookie("token", JSONToken);

  res.redirect("/");
});
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  let user = await user_Model.findOne({ email });
  console.log(user);

  if (user?.email) {
    res.redirect("/login");
    return;
  }

  const hashpassword = await bcrypt.hash(password, 10);

  // Creating a database entry
  const dbCreatedUser = await user_Model.create({
    username: username,
    email: email,
    password: hashpassword,
  });

  // Database user ko id represent garcha , from the returned token of jwt.sign()
  const JSONToken = jwt.sign({ id: dbCreatedUser._id }, "qwertyuiop");
  // yoh "JSONToken" leh database ko user ko id lai represent garcha hai

  res.cookie("token", JSONToken);

  res.redirect("/");
  // res.render("logout");
});

app.listen(8000, () => {
  console.log("server listening ");
});
