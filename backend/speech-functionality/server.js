// records one chunk
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const speech = require("@google-cloud/speech");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const sttClient = new speech.SpeechClient({
  keyFilename: "C:/Users/isabe/Downloads/hackmit-2025-472018-6c3bd724f932.json",
});

// Make transcripts directory
const transcriptsDir = path.join(__dirname, "transcripts");
if (!fs.existsSync(transcriptsDir)) fs.mkdirSync(transcriptsDir);

// Cleanup function to remove old temp files
const cleanupTempFiles = (...filePaths) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.warn("Warning: Could not cleanup temp file:", filePath, err.message);
    }
  });
};

app.post("/stt-chunk", upload.single("audio"), async (req, res) => {
  console.log("=== Received audio chunk ===");
  console.log("Headers:", req.headers);
  console.log("X-Session-File header:", req.headers["x-session-file"]);
  
  const sessionFile = req.headers["x-session-file"];
  if (!sessionFile) {
    console.error("No session file provided");
    console.log("Available headers:", Object.keys(req.headers));
    return res.status(400).json({ transcript: "", error: "No session file" });
  }

  if (!req.file || req.file.size === 0) {
    console.error("No audio file received or file is empty");
    return res.status(400).json({ transcript: "", error: "No audio file or empty file" });
  }

  console.log("Audio file received - size:", req.file.size, "bytes");
  console.log("Audio file mimetype:", req.file.mimetype);
  
  // Skip very small files that are likely empty or corrupted
  if (req.file.size < 1000) {
    console.warn("Audio file too small, skipping:", req.file.size, "bytes");
    cleanupTempFiles(req.file.path);
    return res.json({ transcript: "" });
  }

  const sessionFilePath = path.join(transcriptsDir, sessionFile);
  
  // Create session file if it doesn't exist
  if (!fs.existsSync(sessionFilePath)) {
    try {
      fs.writeFileSync(sessionFilePath, "");
      console.log(`Created new session file: ${sessionFile}`);
    } catch (err) {
      console.error("Error creating session file:", err);
      return res.status(500).json({ transcript: "", error: "Could not create session file" });
    }
  }

  try {
    const audioFilePath = req.file.path;
    const fileBytes = fs.readFileSync(audioFilePath);
    
    console.log("Read audio file, size:", fileBytes.length, "bytes");
    
    // Clean up the uploaded file immediately after reading
    cleanupTempFiles(audioFilePath);
    
    const audio = { content: fileBytes.toString("base64") };
    console.log("Sending to Google Speech API...");
    
    // Try different configurations based on the original format
    const configs = [
      // Configuration for WebM/Opus (most common for web recording)
      {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "latest_long",
        useEnhanced: true,
      },
      // Fallback configuration for OGG/Opus
      {
        encoding: "OGG_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "default",
      },
      // Another fallback for different sample rates
      {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 16000,
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "default",
      }
    ];
    
    let transcript = "";
    let lastError = null;
    
    // Try each configuration
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      console.log(`Trying configuration ${i + 1}:`, config.encoding, config.sampleRateHertz + "Hz");
      
      try {
        const [response] = await sttClient.recognize({
          config,
          audio,
        });

        console.log("Google Speech API response:", JSON.stringify(response, null, 2));

        if (response.results && response.results.length > 0) {
          transcript = response.results
            .map((r) => {
              console.log("Result:", r);
              return r.alternatives[0]?.transcript || "";
            })
            .filter(t => t.trim().length > 0)
            .join(" ");
          
          if (transcript.trim().length > 0) {
            console.log(`Success with config ${i + 1}! Transcript: "${transcript}"`);
            break; // Success, exit the loop
          }
        }
      } catch (err) {
        console.log(`Configuration ${i + 1} failed:`, err.message);
        lastError = err;
        continue; // Try next configuration
      }
    }
    
    if (transcript.trim().length === 0) {
      console.log("All configurations failed or returned empty results");
      if (lastError) {
        console.error("Last error:", lastError.message);
      }
      
      // Return empty transcript instead of error to avoid breaking the flow
      return res.json({ transcript: "", debug: "No speech detected" });
    }

    console.log(`Final transcript: "${transcript}"`);

    // Save to file if we have a transcript
    if (transcript.trim().length > 0) {
      try {
        const timestampedTranscript = `[${new Date().toLocaleTimeString()}] ${transcript}\n`;
        fs.appendFileSync(sessionFilePath, timestampedTranscript);
        console.log(`Saved transcript to ${sessionFile}`);
      } catch (err) {
        console.error("Error saving transcript:", err);
      }
    }

    res.json({ transcript: transcript.trim() });
    
  } catch (err) {
    console.error("STT error:", err);
    cleanupTempFiles(req.file.path);
    res.status(500).json({ 
      transcript: "", 
      error: "Speech recognition failed: " + err.message 
    });
  }
});

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Add an endpoint to list transcript files
app.get("/transcripts", (req, res) => {
  try {
    const files = fs.readdirSync(transcriptsDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        name: file,
        created: fs.statSync(path.join(transcriptsDir, file)).birthtime,
        size: fs.statSync(path.join(transcriptsDir, file)).size
      }))
      .sort((a, b) => b.created - a.created);
    
    res.json({ transcripts: files });
  } catch (err) {
    console.error("Error listing transcripts:", err);
    res.status(500).json({ error: "Could not list transcripts" });
  }
});

// Add endpoint to get specific transcript content
app.get("/transcripts/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(transcriptsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Transcript file not found" });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ filename, content });
  } catch (err) {
    console.error("Error reading transcript:", err);
    res.status(500).json({ error: "Could not read transcript file" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Transcripts will be saved to: ${transcriptsDir}`);
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