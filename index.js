import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./connection.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

dotenv.config();
const app = express();

app.use(express.json({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "Something went wrong",
  });
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
