import React from "react";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
const Modal = ({ content, isOpen }) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalBody>hey wuzzup</ModalBody>
    </Modal>
  );
};

export default Modal;
