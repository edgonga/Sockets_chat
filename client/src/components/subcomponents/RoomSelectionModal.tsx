// RoomSelectionModal.tsx

import React from "react";
import Modal from "react-modal";
import "./RoomSelectionModal.css";
import io from "socket.io-client"

interface RoomSelectionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({ isOpen, onRequestClose }) => {
  const [existingRoom, setExistingRoom] = React.useState("");
  const [newRoom, setNewRoom] = React.useState("");

  const handleExistingRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExistingRoom(event.target.value);
  };

  const handleNewRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoom(event.target.value);
  };

  const handleCreateRoom = () => {
    if (newRoom.trim() !== "") {
      const socket = io("http://localhost:5173")
      socket.emit("newRoom", newRoom, (response: Response) => {
        console.log("Server's response: ", response);
        
      })
    }
    console.log("New room created: ", newRoom);
    onRequestClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select or Create a Room"
      ariaHideApp={false}
    >
      <div className="form-container">
        <h2>Select or Create a Room</h2>
        <div className="option">
          <label htmlFor="existingRoom">Select Existing Room:</label>
          <select
            id="existingRoom"
            value={existingRoom}
            onChange={handleExistingRoomChange}
          >
            <option value="">Select a room</option>
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
            {/* Agrega aquí más opciones para las rooms existentes */}
          </select>
        </div>
        <div className="option">
          <label htmlFor="newRoom">Create New Room:</label>
          <input
            type="text"
            id="newRoom"
            value={newRoom}
            onChange={handleNewRoomChange}
            placeholder="Enter new room name"
          />
        </div>
        <div className="button-container">
          <button onClick={onRequestClose}>Cancel</button>
          <button onClick={handleCreateRoom} disabled={!newRoom}>
            Create Room
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomSelectionModal;
