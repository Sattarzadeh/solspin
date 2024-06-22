import { ApiHandler } from "sst/node/api";
import { initializeDatabase } from "../../../../../game-engine/src/repository/caseRepository";

export const handler = ApiHandler(async (event) => {
  try {
    await initializeDatabase();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Database initialized successfully" }),
    };
  } catch (error) {
    console.error("Error initializing database:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Database initialization failed", error: error.message }),
    };
  }
});
