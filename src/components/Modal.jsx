import React from "react";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
const ModalHandler = ({ header, footer, isOpen, toggle, children }) => {
  return (
    <Modal toggle={toggle} isOpen={isOpen}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default ModalHandler;
