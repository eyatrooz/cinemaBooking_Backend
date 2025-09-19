import express from 'express';
import dotenv from "dotenv";

const app = express();



app.use(express.json());

// Connection to the server
dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running successfully at http://localhost:${PORT}`);
});