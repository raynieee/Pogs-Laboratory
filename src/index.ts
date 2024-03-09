import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const port = process.env.PORT;
const app = createServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});