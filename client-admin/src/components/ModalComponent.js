import React from 'react';

const Modal = (props) => {
  return (
    <div className="modal" id="myModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Thông báo</h4>
            <button type="button" className="close" data-dismiss="modal" onClick={() => props.onClose()}>&times;</button>
          </div>
          <div className="modal-body">
            {props.modalText}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => props.onClose()}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;