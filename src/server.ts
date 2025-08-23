import { Server } from "http";
import app from "./app";
import config from "./config";
import mongoose from "mongoose";
import { connectDB } from "./app/db/db";

let server: Server;

// Main function to start the server
async function main() {
  try {
    await connectDB()
    server = app.listen(config.port, () => {
      console.log("Server is running on port", config.port);
    });
  } catch (error) {
    console.log(error);
  }
}

// Start the server
main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
