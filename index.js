import app from "./src/app.js";
import dotenv from "dotenv";

import {connectDatabase} from "./src/config/mongoose.config.js";

dotenv.config();

const port = process.env.PORT || 3000;

connectDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    })
    .catch((error) => {
        console.log(error);
    })

export default app;