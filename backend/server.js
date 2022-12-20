const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const passportLocal = require("passport-local")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const bodyParser = require("body-parser")
const app = express()
const User = require("./user")

mongoose
  .connect("mongodb://localhost:27017/local-auth")
  .then((res) => console.log(`MongoDB is connected`))
  .catch((err) => console.log("error: ", err))

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// origin: ["http://localhost:3000", "http://127.0.0.1:5173"],

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
  res.header("Access-Control-Allow-Credentials", true)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
)

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
)

app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
require("./passportConfig")(passport)

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err
    if (!user) res.send("No User Exists")
    else {
      req.logIn(user, (err) => {
        if (err) throw err
        res.send("Successfully Authenticated")
        console.log("50 req.user", req.user)
      })
    }
  })(req, res, next)
})
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err
    if (doc) res.send("User Already Exists")
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      })
      await newUser.save()
      res.send("User Created")
    }
  })
})
app.get("/user", (req, res) => {
  res.send(req.user) // The req.user stores the entire user that has been authenticated inside of it.
})

// Start server
app.listen(4000, () =>
  console.log(`Server has been started on http://localhost:4000`)
)
