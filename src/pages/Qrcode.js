import React from "react";
import { useQRCode } from "react-qrcodes";
import { Modal } from "react-bootstrap";

function Qrcode() {
  const [inputRef] = useQRCode({
    text: "hello world",
    options: {
      level: "M",
      margin: 7,
      scale: 1,
      width: 200,
      color: {
        dark: "#010599FF",
        light: "#FFBF60FF",
      },
    },
  });

  return (
    <canvas ref={inputRef} />

    // <Modal
    //   aria-labelledby="conatined-modal-title-vcenter"
    //   centered
    //   //   show={this.state.qrcodeModalShow}
    // >
    //   <Modal.Header
    //     closeButton
    //     // onClick={() => this.setState({ ...this.state, qrcodeModalShow: false })}
    //   >
    //     <Modal.Title id="contained-modal-title-vcenter">
    //       Device Successfully Registered
    //     </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     <canvas ref={inputRef} />
    //   </Modal.Body>
    // </Modal>
  );
}

export default Qrcode;
