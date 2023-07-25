/* eslint-disable */

import React, { createContext, useState, useContext } from "react";

interface UserContextData {
  username: string;
  setUsername: (username: string) => void;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

const chatContext = createContext<UserContextData | null>(null);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [username, setUsername] = useState("");

  return (
    <chatContext.Provider value={{ username, setUsername }}>
      {children}
    </chatContext.Provider>
  );
};

