import { useState } from "react";
import "./App.css";
import LexChat from "./LexChat";

function App() {
  return (
    <>
      <details id="display-bot">
        <summary>Use Reserve-O-Bot</summary>
        <p>
          <LexChat />
        </p>
      </details>
    </>
  );
}

export default App;
