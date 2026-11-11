
"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.jsonl");

// Create data directory if missing
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.static(PUBLIC_DIR));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Server status
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        project: "SKYBLINK",
        status: "Online",
        message: "SKYBLINK server is running."
    });
});

// Mission information
app.get("/api/missions", (req, res) => {
    res.json({
        success: true,
        missions: [
            {
                name: "ORBIT X",
                category: "Earth Orbit",
                status: "Concept"
            },
            {
                name: "DEEP NOVA",
                category: "Deep Space",
                status: "Concept"
            },
            {
                name: "LUNA X",
                category: "Lunar Exploration",
                status: "Concept"
            }
        ]
    });
});

// Contact form
app.post("/api/contact", (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof subject !== "string" ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid form details."
            });
        }

        const contact = {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim()
        };

        if (
            !contact.name ||
            !contact.email ||
            !contact.subject ||
            !contact.message ||
            contact.name.length > 100 ||
            contact.email.length > 254 ||
            contact.subject.length > 150 ||
            contact.message.length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "Please check your form details."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(contact.email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
            });
        }

        const record = {
            ...contact,
            receivedAt: new Date().toISOString()
        };

        fs.appendFileSync(
            MESSAGES_FILE,
            JSON.stringify(record) + "\n",
            "utf8"
        );

        return res.status(201).json({
            success: true,
            message: "Message received successfully."
        });

    } catch (error) {
        console.error("Contact error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log(" SKYBLINK SERVER STARTED");
    console.log(" Port:", PORT);
    console.log(" Status: ONLINE");
    console.log("================================");
});
  
