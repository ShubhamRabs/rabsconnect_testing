import { useBootstrap, useMui } from "../../hooks/Hooks";
import { CustomHeading } from "../Common/Common";
import "./CustomModal.css";

export const CustomModal = (props) => {
  /* Date :- 3-09-2023 
    Author name :- shubham sonkar
    getting the element of bootstrap from useBootstrap with the help of useContext
*/
  const { IconButton, CloseIcon } = useMui();
  const { Modal } = useBootstrap();

  return (
    /* Date :- 5-09-2023 
  Author name :- shubham sonkar
  Creating custom modal to reuse this any wheres
*/
    <Modal
      show={props.show}
      size={props.ModalSize}
      onHide={props.onHide}
      centered
      className="cutom-modal"
      backdrop={props.nobackdrop ? false : true}
    >
      {props.hideCloseIcon ? null : (
        <IconButton onClick={props.onHide} className="close-modal-btn">
          <CloseIcon />
        </IconButton> 
      )}
      {props.showHeader ? (
        <Modal.Header closeButton>
          <CustomHeading Heading={props.ModalTitle} />
        </Modal.Header>
      ) : null}
      <Modal.Body>{props.ModalBody}</Modal.Body>
      {props.ModalFooter !== undefined ? (
        <Modal.Footer>{props.ModalFooter}</Modal.Footer>
      ) : null}
    </Modal>
  );
};

export const DeleteModal = (props) => {
  const { Modal } = useBootstrap();
  const { Button, LoadingButton, ReportProblemOutlinedIcon } = useMui();

  return (
    <Modal
      show={props.show}
      size={props.ModalSize}
      onHide={props.onHide}
      centered
      style={{ zIndex: 9999 }}
      className="delete-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 18 }}>{props.ModalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <ReportProblemOutlinedIcon sx={{ fontSize: 80, color: "#d32f2f" }} />
          <h3 className="my-4">Are you sure?</h3>
          <p className="pb-3">
            Do you really want to delete these records? This process cannot be
            undone.
          </p>
        </div>
        <div className="text-center d-flex justify-content-around pb-3">
          <Button
            variant="contained"
            sx={{ bgcolor: "#484343" }}
            onClick={props.onHide}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            loading={props.loading}
            onClick={props.onclick}
          >
            Delete
          </LoadingButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};
