import { env } from "./env.js";
import { app } from "./app.js";

const port = env.PORT;

app.listen(port, () => console.log("Server is running on port " + port));
