connectDb();
import express from "express";
import type { Request, Response } from "express";
import router from "./src/routes/UserRoutes";
import connectDb from "./src/db/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript backend is running11 🚀");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:3000");
});
