import React, { useState } from "react";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const initializeChat = () => {
  try {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!groqApiKey) {
      throw new Error("GROQ API key not found in environment variables");
    }

    const model = new ChatGroq({
      apiKey: groqApiKey,
      model: "mixtral-8x7b-32768",
      temperature: 0,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a friendly and helpful library assistant..."],
      ["human", "{input}"]
    ]);

    return RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser()
    ]);
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null;
  }
};

const chain = initializeChat();

function Chatbot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!chain) {
      setError("Chat system not properly initialized. Please check API key configuration.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await chain.invoke({ input });
      setResponse(result);
    } catch (error) {
      console.error("Error:", error);
      setError("Sorry, something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.responseBox}>
          {response ? `🤖 Chatbot: ${response}` : ""}
        </div>
        {isLoading && <div>Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Ask me about the library..."
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f0f0f5",
    fontFamily: "Arial, sans-serif",
  },
  chatBox: {
    maxWidth: "600px",
    width: "100%",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  responseBox: {
    marginBottom: "10px",
    color: "#333",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    width: "80%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: '#ff4444',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#ffe6e6',
    borderRadius: '5px',
  }
};

export default Chatbot;
