const express = require("express");
const cors = require("cors");
// const session = require("express-session");
require("dotenv").config();
require("./dbConfig")
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const patronRoutes = require("./routes/patron")
const chapterRoutes = require("./routes/chapters")
const excoRoutes = require("./routes/exco")
const activityRoutes = require("./routes/activities")
const mailingListRoute = require("./routes/mailingList")
const zoneActionRoutes = require("./routes/zoneActions")
const newsRoutes = require("./routes/news")


const jsonParser = express.json();


const app = express();

app.use(cors());
app.use(jsonParser);

app.get("/", async (req, res, next) => {
  res.status(201).json({ message: "Hello from express" })
  // res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.use("/", authRoutes)
app.use("/", patronRoutes)
app.use("/", excoRoutes)
app.use("/", chapterRoutes)
app.use("/profile", profileRoutes)
app.use("/", activityRoutes)
app.use("/mailing-list", mailingListRoute)
app.use("/", zoneActionRoutes)
app.use("/news", newsRoutes)
app.use("/broadcasts", newsRoutes)

//set to allow different domains communication.
app.use((req, res, next) => {
    // res.setHeader("x-access-token, Origin, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method", "POST,GET,PATCH,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Header", "Content-Type,Authorization");
    next();
  });

// app.listen()

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
  
  