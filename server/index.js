import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes/routes.js";
import 'dotenv/config';

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use('/', routes);


const start = async () => {
  mongoose.connect(process.env.DB_CONNECTION);
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
};

start();