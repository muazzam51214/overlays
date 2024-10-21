import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({path: "./.env"});

import connectDB from "./db/connection.js";

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
