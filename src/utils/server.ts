import express from "express";
import routes from "../routes";

function createServer() {
  const app = express();

  app.use(express.json());

  routes(app);

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

export default createServer;