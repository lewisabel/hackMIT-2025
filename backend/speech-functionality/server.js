// part of not super accurate implementations
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const cors = require('cors');
app.use(cors()); 
app.use(express.json());

// Ensure `transcribe/` exists
const folderPath = path.join(__dirname, "transcribe");
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.post('/save-transcript', (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript is empty.' });
  }

  const fileName = `transcript_${Date.now()}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFileSync(filePath, transcript, 'utf8');
  res.json({ message: 'Transcript saved', fileName });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
