import express, { Router } from 'express';
import dotenv from "dotenv";
import database from './Config/database.js';
import userRoutes from './Routes/userRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import moviesRoutes from './Routes/moviesRoutes.js';


const app = express();
app.use(express.json());

dotenv.config();

// connection to the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`The server in running on http://localhost:${PORT}`);
});

// Routes:
app.use("/API/users", userRoutes);
app.use("/API/auth", authRoutes);
app.use("/API/movies", moviesRoutes);

