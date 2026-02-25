import express from "express";
import cors from "cors";
import { generateIndicators, sources } from "./data.js";
import { format } from "@fast-csv/format";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Generate a fixed dataset on startup so results are consistent
const indicators = generateIndicators(500);

/**
 * GET /api/indicators
 *
 * Query parameters:
 *   - page     (number, default: 1)
 *   - limit    (number, default: 20, max: 100)
 *   - severity (string, one of: critical, high, medium, low)
 *   - type     (string, one of: ip, domain, hash, url)
 *   - source   (string, one of: AbuseIPDB, OTX AlienVault, etc)
 *   - search   (string, partial match on indicator value)
 *
 * Response:
 *   {
 *     data: Indicator[],
 *     total: number,
 *     page: number,
 *     totalPages: number
 *   }
 */
app.get("/api/indicators", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const severity = req.query.severity?.toLowerCase();
  const type = req.query.type?.toLowerCase();
  const source = req.query.source;
  const search = req.query.search?.toLowerCase();

  let filtered = [...indicators];

  if (severity && ["critical", "high", "medium", "low"].includes(severity)) {
    filtered = filtered.filter((i) => i.severity === severity);
  }

  if (type && ["ip", "domain", "hash", "url"].includes(type)) {
    filtered = filtered.filter((i) => i.type === type);
  }

  if (source && sources.includes(source)) {
    filtered = filtered.filter((i) => i.source === source);
  }

  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.value.toLowerCase().includes(search) ||
        i.source.toLowerCase().includes(search) ||
        i.tags.some((t) => t.toLowerCase().includes(search)),
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  // Simulate slight network latency (200–600ms)
  const delay = 200 + Math.random() * 400;
  setTimeout(() => {
    res.json({ data, total, page, totalPages });
  }, delay);
});

/**
 * GET /api/indicators
 *
 * Returns a CSV of all indicators.
 */
app.get("/api/indicators/csv", (_req, res) => {
  const data = [...indicators];
  // Set headers to trigger a file download
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');

  // Create a CSV stream with headers
  const csvStream = format({ headers: true });

  // Pipe the CSV stream to the response object
  csvStream.pipe(res);

  // Write data to the stream
  data.forEach((row) => csvStream.write(row));

  // End the stream
  csvStream.end();
});

/**
 * GET /api/indicators/:id
 *
 * Returns a single indicator by ID.
 */
app.get("/api/indicators/:id", (req, res) => {
  const indicator = indicators.find((i) => i.id === req.params.id);
  if (!indicator) {
    return res.status(404).json({ error: "Indicator not found" });
  }
  const delay = 100 + Math.random() * 200;
  setTimeout(() => {
    res.json(indicator);
  }, delay);
});

/**
 * GET /api/stats
 *
 * Returns summary statistics for the dashboard header.
 */
app.get("/api/stats", (_req, res) => {
  const stats = {
    total: indicators.length,
    critical: indicators.filter((i) => i.severity === "critical").length,
    high: indicators.filter((i) => i.severity === "high").length,
    medium: indicators.filter((i) => i.severity === "medium").length,
    low: indicators.filter((i) => i.severity === "low").length,
    byType: {
      ip: indicators.filter((i) => i.type === "ip").length,
      domain: indicators.filter((i) => i.type === "domain").length,
      hash: indicators.filter((i) => i.type === "hash").length,
      url: indicators.filter((i) => i.type === "url").length,
    },
  };
  res.json(stats);
});

/**
 * POST /api/indicators
 *
 * Creates a new indicator.
 */
app.post("/api/indicators", (req, res) => {
  const indicator = req.body;
  indicators.push(indicator);
  res.status(201).json(indicator);
});

/**
 * DELETE /api/indicators/:id
 *
 * Deletes an indicator by ID.
 */
app.delete("/api/indicators/:id", (req, res) => {
  const indicatorIndex = indicators.findIndex((i) => i.id === req.params.id);
  indicators.splice(indicatorIndex, 1);
  res.sendStatus(204);
})

/**
 * PUT /api/indicators/:id
 *
 * Updates an indicator by ID.
 */
app.put("/api/indicators", (req, res) => {
  const indicatorIndex = indicators.findIndex((i) => i.id === req.body.id);
  indicators[indicatorIndex] = {...indicators[indicatorIndex], ...req.body};
  res.status(200).json(indicators[indicatorIndex]);

})

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `\n  🛡  Mock Threat Intel API running at http://localhost:${PORT}`,
    );
    console.log(`  📊 ${indicators.length} indicators loaded\n`);
  });
}

export default app;
