"use client";

import React, { useState, useRef } from 'react';

function Audiobot() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunks.current = []; // Clear recorded chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };
  return (
    <div className="audiobot">
      <h1>Audiobot</h1>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {audioUrl && (
        <div>
          <h2>Recorded Audio:</h2>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {
        response && (
          <div>
            <h2>Response:</h2>
            <audio controls src={response}></audio>
          </div>
        )
      }
    </div>
  );
}

export default Audiobot;
