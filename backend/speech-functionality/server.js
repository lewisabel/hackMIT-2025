// part of not super accurate implementations
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure `transcripts/` exists
const folderPath = path.join(__dirname, "transcripts");
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.post("/save-transcript", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).send("Transcript is empty.");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(folderPath, `transcript-${timestamp}.txt`);

  fs.writeFile(filePath, text, (err) => {
    if (err) {
      console.error("Error saving transcript:", err);
      return res.status(500).json({ error: "Failed to save transcript." });
    }
    res.json({ message: "Transcript saved successfully!", fileName: path.basename(filePath) });
  });
});

app.get("/api/latest-transcript", (req, res) => {
  const folderPath = path.join(__dirname, "transcripts");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading transcripts folder:", err);
      return res.status(500).json({ error: "Failed to read transcripts" });
    }

    // Filter only .txt files and sort by modified time descending
    const txtFiles = files
      .filter(f => f.endsWith(".txt"))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(folderPath, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (txtFiles.length === 0) {
      return res.status(404).json({ error: "No transcripts found" });
    }

    const latestFile = txtFiles[0].name;
    const filePath = path.join(folderPath, latestFile);
    const transcript = fs.readFileSync(filePath, "utf-8");

    res.json({ fileName: latestFile, transcript });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Transcripts will be saved to: ${folderPath}`);
  console.log("Using direct Google Speech API (no FFmpeg conversion)");
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  // Clean up any remaining temp files
  try {
    const uploadsDir = path.join(__dirname, "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        try {
          fs.unlinkSync(path.join(uploadsDir, file));
        } catch (e) {
          console.warn("Could not clean up temp file:", file);
        }
      });
    }
  } catch (e) {
    console.warn("Error during cleanup:", e.message);
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  process.exit(0);
});


;
const router = express.Router();

const transcriptsDir = path.join(__dirname, "../transcripts");

// Utility: get the newest transcript file
function getLatestTranscriptFile() {
  const files = fs.readdirSync(transcriptsDir)
    .filter(f => f.endsWith(".txt"))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(transcriptsDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time); // newest first

  return files.length > 0 ? files[0].name : null;
}

// API: return contents of latest transcript
router.get("/latest-transcript", (req, res) => {
  try {
    const latestFile = getLatestTranscriptFile();
    if (!latestFile) {
      return res.status(404).json({ error: "No transcripts found" });
    }

    const content = fs.readFileSync(
      path.join(transcriptsDir, latestFile),
      "utf8"
    );

    res.json({ fileName: latestFile, transcript: content });
  } catch (err) {
    console.error("Error reading latest transcript:", err);
    res.status(500).json({ error: "Failed to read transcript" });
  }
});

module.exports = router;
