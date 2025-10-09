import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// database connection:
const pool = mysql2.createPool(
    {
        host: process.env.DB_host,
        user: process.env.DB_user,
        password: process.env.DB_password,
        database: process.env.DB_name,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
)

// test connection when the app starts
const testConnection = async () => {
    try {

        const connection = await pool.getConnection();
        console.log(`Connected to mySQL database successfully!!`);

    } catch (error) {
        console.error('Error occurred while connecting to database:', error.message);
        process.exit(1);
    }
};
testConnection();

const database = {
    pool,
    testConnection,
};

// Export the entire database object
export default database;
