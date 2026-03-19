import app, { initDb } from "./app";

const PORT = process.env.PORT || 8000;

initDb()
  .then(() => {
    console.log("✅ Database connected & tables ready");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
