// ------------ records one chunk
import React, { useState, useRef, useEffect } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [sessionFile, setSessionFile] = useState("");
  const streamRef = useRef(null);
  const sessionFileRef = useRef("");
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sendChunk = async (chunk) => {
    const currentSessionFile = sessionFileRef.current;
    
    console.log("=== SENDING CHUNK ===");
    console.log("Session file:", currentSessionFile);
    console.log("Chunk size:", chunk.size);
    console.log("Chunk type:", chunk.type);
    
    if (!currentSessionFile) {
      console.error("No session file available for chunk");
      return;
    }

    if (chunk.size === 0) {
      console.warn("Empty chunk, skipping");
      return;
    }

    const formData = new FormData();
    formData.append("audio", chunk, "chunk.webm");

    try {
      console.log("Making fetch request...");
      const res = await fetch("http://localhost:3001/stt-chunk", {
        method: "POST",
        headers: {
          "X-Session-File": currentSessionFile,
        },
        body: formData,
      });
      
      console.log("Response status:", res.status);
      const result = await res.json();
      console.log("Response data:", result);
      
      if (result.transcript && result.transcript.trim()) {
        console.log("Adding transcript:", result.transcript);
        setTranscript((prev) => prev + (prev ? " " : "") + result.transcript);
      }
      
      if (result.error) {
        console.error("Server error:", result.error);
      }
    } catch (err) {
      console.error("Error sending chunk:", err);
    }
  };

  const collectAndSendChunk = async () => {
    console.log("=== COLLECT AND SEND ===");
    console.log("Audio chunks available:", audioChunksRef.current.length);
    
    if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      console.log("Created blob with size:", blob.size);
      audioChunksRef.current = []; // Clear chunks
      await sendChunk(blob);
    } else {
      console.log("No audio chunks to send");
    }
  };

  const startRecording = async () => {
    try {
      console.log("=== STARTING RECORDING ===");
      
      // New transcript file per session
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const newSessionFile = `transcript_${timestamp}.txt`;
      setSessionFile(newSessionFile);
      sessionFileRef.current = newSessionFile;
      setTranscript("");

      console.log("Session file:", newSessionFile);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        } 
      });
      
      streamRef.current = stream;
      console.log("Got media stream");

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("=== DATA AVAILABLE ===");
        console.log("Data size:", e.data.size);
        console.log("Data type:", e.data.type);
        
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("Added to chunks, total chunks:", audioChunksRef.current.length);
        }
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
      };

      mediaRecorder.onstart = () => {
        console.log("MediaRecorder started successfully");
      };

      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped");
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every 1 second
      console.log("MediaRecorder.start() called");
      
      // Set up interval to send chunks every 3 seconds
      intervalRef.current = setInterval(async () => {
        console.log("=== INTERVAL TICK ===");
        await collectAndSendChunk();
      }, 10000);
      
      setRecording(true);
      console.log("Recording state set to true");
      
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Error accessing microphone: " + err.message);
    }
  };

  const stopRecording = async () => {
    console.log("=== STOPPING RECORDING ===");
    setRecording(false);
    
    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Cleared interval");
    }
    
    // Stop recorder and send final chunk
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      
      // Wait a bit then send final chunks
      setTimeout(async () => {
        await collectAndSendChunk();
      }, 500);
    }
    
    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      console.log("Stopped audio tracks");
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Live STT Demo</h2>
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={startRecording} 
          disabled={recording}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            fontSize: "16px",
            backgroundColor: recording ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: recording ? "not-allowed" : "pointer"
          }}
        >
          Start Recording 🎤
        </button>
        <button 
          onClick={stopRecording} 
          disabled={!recording}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: !recording ? "#ccc" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: !recording ? "not-allowed" : "pointer"
          }}
        >
          Stop Recording 🛑
        </button>
      </div>

      {recording && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#e7f3ff", 
          borderRadius: "5px",
          marginBottom: "20px"
        }}>
          🔴 Recording... (Session: {sessionFile})
          <br />
          <small>Requesting data every 10s, minimum 10KB chunks</small>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>Transcript:</h3>
        <div style={{ 
          border: "1px solid #ddd", 
          padding: "15px", 
          minHeight: "100px",
          backgroundColor: "#f9f9f9",
          borderRadius: "5px",
          whiteSpace: "pre-wrap"
        }}>
          {transcript || "No transcription yet..."}
        </div>
      </div>

      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        Debug: Recording = {recording.toString()}, Session = {sessionFile}
      </div>
    </div>
  );
}

export default App;