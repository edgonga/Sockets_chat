// RoomSelectionModal.tsx

import React from "react";
import Modal from "react-modal";

interface RoomSelectionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select or Create a Room"
      ariaHideApp={false}
    >
      <h2>Select or Create a Room</h2>
      {/* Agrega aquí el formulario o las opciones para seleccionar o crear una nueva sala */}
    </Modal>
  );
};

export default RoomSelectionModal;
