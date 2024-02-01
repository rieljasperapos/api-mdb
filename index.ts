import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './src/util/config.util';
import booksRoutes from "./src/routes/books.routes"
import { db } from './src/db/dbconnect';
import userRoutes from './src/routes/user.routes'
import authRoutes from './src/routes/authenticate.routes'
import cookieParser from 'cookie-parser'

db();
const port = config.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));

app.use(userRoutes);
app.use(booksRoutes);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});

