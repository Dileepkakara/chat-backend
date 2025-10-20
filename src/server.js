import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.router.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body

// simple request logger to see incoming requests in logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Origin:${req.headers.origin || "none"}`);
    next();
});

// health check
app.get("/health", (_req, res) => res.json({ ok: true, time: Date.now() }));

const clientOrigins = [
    ENV.CLIENT_URL || "https://chat-app-sigma-smoky.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (clientOrigins.includes(origin)) return callback(null, true);
        callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// make ready for deployment
/*if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}*/

server.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
    connectDB();
});