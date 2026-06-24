import app, { initDb } from "./app";
import { getActiveStorageBackend } from "./config/db";

const PORT = process.env.PORT || 8000;

initDb()
  .then(() => {
    const storageBackend = getActiveStorageBackend();
    if (storageBackend === "postgres") {
      console.log("✅ Auth storage ready using PostgreSQL");
    } else {
      console.log("✅ Auth storage ready using local file fallback");
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
