import { useState } from "react";
import "./App.css";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;
 
function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState("");

  const handleSynthesize = async (text) => {
    const pollyClient = new PollyClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Engine: "neural",
      Text: text,
      VoiceId: "Ruth",
      OutputFormat: "mp3",
    });

    try {
      const response = await pollyClient.send(synthesizeSpeechCommand);
      const audioArray = await response.AudioStream.transformToByteArray()
      const blob = new Blob([audioArray], { type: 'audio/mpeg' });
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to synthesize"
      />
      <button onClick={() => handleSynthesize(text)}>
        Synthesize Speech
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </>
  );
}

export default App;
