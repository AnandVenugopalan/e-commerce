
import app from "./app.js"
import connectDB from "./config/db.js";


const PORT = process.env.PORT || 5000;
connectDB();


app.listen(5000, () => {
  console.log("Server is running on port ${PORT}");
});