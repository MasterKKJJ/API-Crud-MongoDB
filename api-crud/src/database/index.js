const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true
      }
    );

    console.log("✅ Stable database connection established!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Encerra o processo em caso de erro
  }
};
connectDB();
mongoose.Promise = global.Promise;

module.exports = mongoose;
