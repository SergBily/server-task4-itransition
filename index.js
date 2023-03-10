import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { router as authRoutes } from './routes/auth-routes.js';
import cookieParser from 'cookie-parser';
import { erorrMiddleware } from './middlewares/error-middleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use(cors({
  origin: [process.env.CLIENT_URL],
  methods: ["GET", "POST", "DELETE", "PATCH"],
  credentials: true,
}));
app.use("/", authRoutes);
app.use(erorrMiddleware);

const start =  () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT);
}

start();