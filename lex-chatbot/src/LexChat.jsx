import React, { useState } from 'react';
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";


// These are all from your AWS account
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const AWS_BOT_ID = import.meta.env.VITE_AWS_BOT_ID;
const AWS_BOT_ALIAS_ID = import.meta.env.VITE_AWS_BOT_ALIAS_ID;


// 
const client = new LexRuntimeV2Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});


const LexChat = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([{ sender: 'reserve-o-bot', text: "Type 'Hello' to start your reservation." }]);

  // Just for development - you would have to use a better solution here
  const [sessionId] = useState(`test-session-${Date.now()}`);

  const botParams = {
    botId: AWS_BOT_ID,
    botAliasId: AWS_BOT_ALIAS_ID,
    localeId: "en_US",
    sessionId: sessionId
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
  
    const userMessage = { sender: 'user', text: inputText };
    // this is to keep track of the messages you (the user) sent and make it look like a chat
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    const command = new RecognizeTextCommand({
      ...botParams,
      text: inputText,
    });
  
    try {
      const response = await client.send(command);
      const botMessages = response.messages.map((msg) => ({ sender: 'bot', text: msg.content }));
      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      console.error("Error:", error);
    }
  
    setInputText('');
  };

  return (
    <div id="app-case">
      <div id="messages">
        {messages.map((message, index) => (
          <div key={index} className={message.sender}>
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default LexChat;