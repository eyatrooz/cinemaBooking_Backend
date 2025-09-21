import express from 'express';
import dotenv from "dotenv";
import database from './Config/database.js';


const app = express();

app.use(express.json());

dotenv.config();
