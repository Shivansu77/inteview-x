import app, { initDb } from "../src/app";

// Initialize DB on cold start
initDb().catch(console.error);

export default app;
