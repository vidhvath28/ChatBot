import React, { useState } from "react";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Access the environment variable
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error("Groq API key not found. Please set the GROQ_API_KEY environment variable.");
}

const model = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  headers: {
    Authorization: `Bearer ${groqApiKey}`,
  },
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a friendly and helpful library assistant. Your primary role is to assist users with all library-related queries. You can provide information about:- Available books and their locations- Library hours and services- Book recommendations- Library membership details- Academic resources- Study spaces and facilitiesRespond with enthusiasm and helpfulness, always maintaining a warm and professional tone. If a query is not related to the library, politely redirect the user and explain that you're specialized in library assistance. Your goal is to make every library interaction informative, pleasant, and efficient."],
  ["human", "{input}"]
]);

const chain = RunnableSequence.from([
  prompt,
  model,
  new StringOutputParser()
]);

function Chatbot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await chain.invoke({ input });
      setResponse(result);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        <div style={styles.responseBox}>{response ? `🤖 Chatbot: ${response}` : ""}</div>
        {isLoading ? <div>Loading...</div> : null}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Ask me about the library..."
        />
        <button type="submit" style={styles.button}>Send</button>
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
};

export default Chatbot;
