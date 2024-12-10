import React from "react";
import Chatbot from "./Chatbot"; // Import the Chatbot component

function App() {
  return (
    <div style={styles.appContainer}>
      <h1 style={styles.header}>Library Assistant Chatbot</h1>
      <Chatbot /> {/* Render the Chatbot component */}
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f5",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "20px",
    color: "#333",
  },
};

export default App;
