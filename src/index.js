import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import connectDB from "./db/connection.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in MongoDB : ", error);
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is running in port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed!", error);
  });
