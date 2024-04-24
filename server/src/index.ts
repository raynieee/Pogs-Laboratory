import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const port = process.env.NEXT_PUBLIC_SERVER_URL;
const app = createServer();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});