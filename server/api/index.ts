import app, { initDb } from "../src/app";
import type { IncomingMessage, ServerResponse } from "http";

let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
	if (!initPromise) {
		initPromise = initDb().catch((error) => {
			// Reset so a later request can retry after env/config fixes.
			initPromise = null;
			throw error;
		});
	}
	return initPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
	try {
		await ensureInitialized();
		return app(req as any, res as any);
	} catch (error) {
		console.error("Server init error:", error);
		if (!res.headersSent) {
			res.statusCode = 500;
			res.setHeader("content-type", "application/json");
			res.end(
				JSON.stringify({
					success: false,
					message: "Server initialization failed. Check backend environment variables and database connectivity.",
				})
			);
			return;
		}
		res.end();
	}
}
