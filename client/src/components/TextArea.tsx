/* eslint-disable */
import React, { useState } from "react";
import "./TextArea.css";
import { useLocation } from "react-router-dom";

const TextArea: React.FC = ({}) => {
  const [text, setText] = useState("");
  const location = useLocation();
  const { state: { username } = {} } = location;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleButtonClick = async () => {
    try {

      const message = {
        content: text,
        sender: username
      }

      await fetch("http://localhost:5173/newMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      console.log(`Message sent`);
    } catch (error) {
      console.error(`Error: `, error);
    }
  };

  return (
    <div className="textarea-container">
      <textarea
        className="textarea"
        value={text}
        onChange={handleChange}
        placeholder="Send a message"
      />
      <button className="textarea-button" onClick={handleButtonClick}>
        Send
      </button>
    </div>
  );
};

export default TextArea;
