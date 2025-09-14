// part of not super accurate implementations
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure `transcribe/` exists
const folderPath = path.join(__dirname, "transcribe");
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
      return res.status(500).send("Failed to save transcript.");
    }
    res.send("Transcript saved successfully!");
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
