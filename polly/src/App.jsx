import { useState } from "react";
import "./App.css";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;
 
function App() {
  const [text, setText] = useState("");

  const synthesizeAudio = async (sourceDestinationConfig) => {
    const pollyClient = new PollyClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    const synthesizeSpeechCommand = new SynthesizeSpeechCommand({
      Engine: "neural",
      Text: sourceDestinationConfig.translated_text,
      VoiceId: "Ruth",
      OutputFormat: "mp3",
    });

    const { AudioStream } = await pollyClient.send(synthesizeSpeechCommand);

    const audioKey = `${sourceDestinationConfig.object}.mp3`;

    // Store the audio file in S3.
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: audioKey,
        Body: AudioStream,
        ContentType: "audio/mp3",
        CORSHeaders: {
          'Access-Control-Allow-Origin': '*'
        }
      },
    });

    await upload.done();
    return audioKey;
  };

  const handleSynthesize = async () => {
    try {
      const result = await synthesizeAudio({
        bucket: BUCKET_NAME,
        translated_text: text,
        object: "unique-file-name",
      });
      console.log("Audio file created:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <>
  <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to synthesize"
      />
      <button onClick={handleSynthesize}>
        Synthesize Speech
      </button>
  </>;
}

export default App;
