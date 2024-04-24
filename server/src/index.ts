import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const port = process.env.PORT || 8080;
const app = createServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});