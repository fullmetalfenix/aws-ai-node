import { useState } from "react";
import "./App.css";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;

function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState("");

  const handleSynthesize = async (text) => {
    const pollyClient = new PollyClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Engine: "neural",
      Text: text,
      VoiceId: "Ruth",
      OutputFormat: "mp3",
    });

    try {
      const response = await pollyClient.send(synthesizeSpeechCommand);
      const audioArray = await response.AudioStream.transformToByteArray();
      const blob = new Blob([audioArray], { type: "audio/mpeg" });

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
    <div>
      <picture>
        <source srcSet="/parrot.png" type="image/png" />
        <img
          src="/parrot.png"
          alt="Cool Punk Rock Parrot with Sunglasses"
          loading="lazy"
          style={{ maxWidth: "250px", height: "auto" }}
        />
      </picture>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "350px",
          width: "600px",
          background: "#4bff36",
          margin: "auto",
          marginTop: "50px",
          borderRadius: "10px",
          boxShadow: "-15px -15px 2px #FF9539, 15px 15px 2px #02FEE5"
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to synthesize"
          style={{
            height: "102px",
            width: "400px",
            fontSize: "18px",
            borderRadius: "17px",
            padding: "12px 25px",
            marginBottom: "20px",
          }}
        />
        <button 
        style={{
          height: "50px",
          width: "450px",
          fontSize: "18px",
          borderRadius: "17px",
          padding: "12px 25px",
          marginBottom: "20px",
          background: "#5E57FF",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
        
        }}
        onClick={() => handleSynthesize(text)}>
          Synthesize Speech
        </button>
        {audioUrl && <audio src={audioUrl} controls />}
      </div>
    </div>
  );
}

export default App;
