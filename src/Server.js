// Here is the server connection:

import app from "./app.js"




const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running successfully at http://localhost:${PORT}`);
});