/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./ChatBox.css";
import RoomSelectionModal from "./subcomponents/RoomSelectionModal";

const ChatBox: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:3000/conversation");
        //const data = await response.json();
        const data = [
          { id: 1, text: "Hola, ¿cómo estás?", sender: "other" },
          { id: 2, text: "¡Hola! Estoy bien, gracias.", sender: "own" },
        ];

        setMessages(data);
        setIsModalOpen(true)
      } catch (err) {
        console.error("Error in fetching the conversation: ", err);
      }
    };

    fetchMessages();
  }, [messages]);

  const handleIsModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="chat-box">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${
            message.sender === "own" ? "own-message" : "other-message"
          }`}
        >
          {message.text}
        </div>
      ))}
      <RoomSelectionModal isOpen={isModalOpen} onRequestClose={handleIsModalClose} />
    </div>
  );
};

export default ChatBox;
