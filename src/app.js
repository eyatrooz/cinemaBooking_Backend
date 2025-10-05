import express, { Router } from 'express';
import dotenv from "dotenv";
import database from './Config/database.js';
import userRoutes from './Routes/userRoutes.js';
import authRoutes from './Routes/authRoutes.js';


const app = express();
app.use(express.json());

dotenv.config();

// connection to the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Routes:
app.use("/API/users", userRoutes);
app.use("/API/auth", authRoutes);

