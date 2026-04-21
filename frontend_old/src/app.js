import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>React is working 🚀</h1>

      <p>This is App.js</p>

      <button
        onClick={() => setCount((prev) => prev + 1)}
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Count: {count}
      </button>
    </div>
  );
}