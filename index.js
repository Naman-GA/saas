const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./config/db.config.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

const roleRoutes=require("./routes/roleRoute")
const userRoutes=require("./routes/userRoute")
const communityRoutes=require("./routes/communityRoute");
const memberRoutes=require("./routes/memberRoute.js");

app.use('/role',roleRoutes);
app.use('/user',userRoutes);
app.use("/community",communityRoutes);
app.use('/member',memberRoutes);

mongoose.Promise = global.Promise;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };
mongoose
  .connect(dbConfig.url, options, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database.", err);
    process.exit();
  });

app.listen(6000, () => console.log(`Server Started on 6000`));