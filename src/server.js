import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.router.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: "http://chat-app-sigma-smoky.vercel.app", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// make ready for deployment
const frontendDist = path.join(process.cwd(), "frontend", "dist");

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    // serve frontend for any non-API route
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    // simple API-only root to avoid "Cannot GET /"
    app.get("/", (req, res) => res.send("API is running. Frontend not built/deployed."));
}

server.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
    connectDB();
});