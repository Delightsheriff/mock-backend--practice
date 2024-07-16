// server.ts

import { ENVIRONMENT } from "./common/config/environment";
import app from "./index";
import { connectDb } from "./common/config/database";

const startServer = async () => {
  try {
    await connectDb();

    app.listen(ENVIRONMENT.APP.PORT, () => {
      console.log(
        `=> ${ENVIRONMENT.APP.NAME} app listening on port ${ENVIRONMENT.APP.PORT}!`,
      );
    });
  } catch (error) {
    console.error("Failed to start the server", error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down");
  // Add any cleanup operations here
  process.exit(0);
});
