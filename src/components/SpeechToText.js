// src/components/SpeechToText.js

import React, { useState, useEffect } from "react";
import annyang from "annyang";
import axios from "axios";

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Initialize annyang and set up speech recognition
    if (annyang) {
      // Add commands for speech recognition if needed
      annyang.addCallback("result", handleSpeechResult);

      // Clean up function to abort speech recognition when component unmounts
      return () => {
        annyang.abort();
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleSpeechResult = (phrases) => {
    setTranscript(phrases[0]);
  };

  useEffect(() => {
    const data = {
      chatID: 123,
      phrase: transcript,
    };
    if (transcript.length > 0) {
      axios
        .post(
          "https://webhook.site/48a7ecd5-e187-470e-b7d3-086ec5aa5454",
          data,
          {
            params: data,
            headers: {
              "Content-Type": "application/json"
            },
          }
        )
        .then((res) => {
          console.log(res.status, "=> " + JSON.stringify(data));
        });
    }
  }, [transcript]);

  const startSpeechRecognition = () => {
    // Start speech recognition when the "Call" button is clicked
    if (annyang) {
      annyang.start({ autoRestart: true, continuous: false });
      setIsListening(true);
    }
  };

  const endSpeechRecognition = () => {
    // End speech recognition when the "End Call" button is clicked
    if (annyang) {
      annyang.abort();
      setIsListening(false);
    }
  };

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startSpeechRecognition} disabled={isListening}>
        Call
      </button>
      <button onClick={endSpeechRecognition} disabled={!isListening}>
        End Call
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;
