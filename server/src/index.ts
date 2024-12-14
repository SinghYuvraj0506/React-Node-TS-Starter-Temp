import app from "./app";
import dotenv from "dotenv"
dotenv.config()

app.on("error", (err: any) => {
  console.log("Error occured in express server", err);
  throw err;
});

app.listen(process.env.PORT, () => {
  console.log("Server running at port", process.env.PORT);
});
