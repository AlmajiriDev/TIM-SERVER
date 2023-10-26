const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((e) => {
    console.log("MongoDb is not connecting" + e);
  });
