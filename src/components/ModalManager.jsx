import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
//
import { closeModal } from "../actions/currentActions";
import SignInUp from "./Modals/SignInUp.jsx";
//
const modals = {
  SIGN_IN: <SignInUp />
};
const ModalManager = ({ modalName, closeModal }) => {
  const toggle = () => {
    closeModal();
  };
  return (
    <Modal toggle={toggle} isOpen={!!modalName} fade>
      {modals[modalName]}
    </Modal>
  );
};
const mapState = state => ({
  modalName: state.current.modal
});
const mapDispatch = {
  closeModal
};
export default connect(
  mapState,
  mapDispatch
)(ModalManager);
