const mongoose = require("mongoose");
const db_url = process.env.MongodbURI;
const connectDB = async () => {
  await mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
