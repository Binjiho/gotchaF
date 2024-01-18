import React, { createContext, useContext, useState } from "react";
import Modal from "@/components/modal/confirm"; // Modal 컴포넌트를 import

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [onConfirm, setOnConfirm] = useState(() => {});
  const [onClose, setOnClose] = useState(() => {});

  const openModal = (content, onConfirmCallback, onCloseCallback) => {
    setModalContent(content);
    setOnConfirm(() => onConfirmCallback);
    setOnClose(() => onCloseCallback);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setOnConfirm(() => {});
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const confirmModal = () => {
    onConfirm();
    closeModal();
  };

  return (
    <ModalContext.Provider
      value={{ modalOpen, openModal, closeModal, modalContent, confirmModal }}>
      {children}
      <Modal /> {/* Modal 컴포넌트를 여기서 렌더링합니다. */}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
