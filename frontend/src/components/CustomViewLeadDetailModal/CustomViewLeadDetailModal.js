import React from "react";
import { useBootstrap } from "../../hooks/Hooks";
import ViewLeadDetails from "../../pages/Leads/ViewLeadDetails";

const CustomViewLeadDetailModal = (props) => {
  const { Modal } = useBootstrap();
  return (
    <Modal
      show={props.show}
      size="xl"
      onHide={props.onHide}
      centered
      className="broker-modal"
      backdrop={props.nobackdrop ? false : true}
      style={{ height: "95vh", overflowY: "scroll" }}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 18 }}>{props.ModalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <ViewLeadDetails dispatch={props.dispatch} myglobalData={props.myglobalData} />
      </Modal.Body>
    </Modal>
  );
};

export default CustomViewLeadDetailModal;
