import React from "react";
import ChatBox from "../components/ChatBox"; 
import Header from "../components/Header";
import Footer from "../components/Footer";
import TextArea from "../components/TextArea";
import "./Chat.css"

const Chat: React.FC = () => {
  return (
    <>
      <Header />
      <div className="App">
        
        <ChatBox />
        <TextArea />
        <Footer />
      </div>
    </>
  );
};

export default Chat;