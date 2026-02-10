// Dependencies
import express from "express";
import cors from "cors";
import "dotenv/config";

// Local functions
import { getAppResourceValues, getDisplayLayouts, getPackageVersions } from "./scripts/functions.mjs";

const app = express();
const port = process.env.API_PORT;

app.use(cors());

app.listen(port, () => {
    console.log(`Altinn Studio Custom Components API listening on port ${port}`);
});

app.get("/api/displayLayouts", async (req, res) => {
    try {
        const layouts = await getDisplayLayouts();
        res.json(layouts);
    } catch (error) {
        console.error("Error fetching display layouts:", error);
        res.status(500).json({ error: "Failed to fetch display layouts" });
    }
});

app.get("/api/packageVersions", async (req, res) => {
    try {
        const packageVersions = await getPackageVersions();
        res.json(packageVersions);
    } catch (error) {
        console.error("Error fetching package.json files:", error);
        res.status(500).json({ error: "Failed to fetch package.json files" });
    }
});

app.get("/api/appResources", async (req, res) => {
    try {
        const appResources = await getAppResourceValues("nb");
        res.json(appResources);
    } catch (error) {
        console.error("Error fetching app resource values:", error);
        res.status(500).json({ error: "Failed to fetch app resource values" });
    }
});
