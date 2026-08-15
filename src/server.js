import "dotenv/config";
import { app } from "./app.js";
import { AppDataSource } from "./data-source.js";

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await AppDataSource.initialize();

    console.log("Database connection established.");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
}

startServer();