// not super accurate but hopefully works
import React, { useState, useEffect, useRef } from "react";

const SpeechToText = () => {
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript + " ";
        }
      }

      // update state
      setFinalText((prev) => prev + final);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    setFinalText("");
    setInterimText("");
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);

      // 👇 Grab the latest transcript before stopping
      const transcriptToSave = (finalText + " " + interimText).trim();

      setTimeout(() => {
        recognitionRef.current.stop();

        // Only save if we actually have something
        if (transcriptToSave) {
          saveToServer(transcriptToSave);
        }
      }, 500); // delay helps flush last words
    }
  };

  const saveToServer = async (content) => {
    try {
      const res = await fetch("http://localhost:5000/save-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });

      const msg = await res.text();
      console.log("✅ Server response:", msg);
    } catch (err) {
      console.error("❌ Error saving transcript:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">🎤 Speech to Text</h2>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded ${
          isListening ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isListening ? "Stop & Save" : "Start Recording"}
      </button>

      <div className="mt-4 p-2 border rounded min-h-[100px] text-left whitespace-pre-wrap">
        <strong>Final:</strong> {finalText}
        <br />
        <em style={{ color: "gray" }}>{interimText}</em>
      </div>
    </div>
  );
};

export default SpeechToText;