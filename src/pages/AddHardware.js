import React, { Component } from "react";
import { Form, Button, InputGroup, Card, Spinner } from "react-bootstrap";
import $ from "jquery";
import { connect } from "react-redux";

import { BASE_URL } from "../baseValues";
// import hardwareRegister from "../assets/images/hardware-register.PNG";
import hardwareRegister from "../assets/images/addhardware.svg";

import swal from "sweetalert";

import Qrcode from "./Qrcode";

const cardStyle = {
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px 0px #000",
  // width: '40rem',
  // height: '34rem',
  // marginLeft: "1rem",
  // marginRight: "1rem",
  // marginTop: "0.8rem",
};

// const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
// }

// const photoStyle = {
//     // height: '300px',
//     width: '90%',
// }

// const imageContainer = {
//     display: 'flex',
//     justifyContent: 'center',
// }

const buttonContainer = {
  display: "flex",
  justifyContent: "center",
};

export class AddHardware extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodNumber: "",
      progress: {
        add: false,
        verify: false,
      },
    };
  }

  updateProductionNumber = (e) => {
    this.setState({ ...this.state, prodNumber: e.target.value });
  };

  putToast = (header, status, message) => {
    this.props.putToast(header, status, message);
  };

  registerHardware = (e) => {
    e.preventDefault();

    let accessToken = this.props.accessToken;
    let { prodNumber } = this.state;

    if (prodNumber) {
      let { progress } = this.state;
      progress.add = true;
      this.setState({ ...this.state, progress });

      let data = JSON.stringify({
        production_number: prodNumber,
      });

      $.ajax({
        method: "POST",
        url: BASE_URL + "/api/hardware/crud/",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        data,
        dataType: "json",
        success: (resp) => {
          this.props.updateHardwareInfo();

          progress.add = false;
          this.setState({ ...this.state, progress, qrcodeModalShow: true });

          //   this.putToast(
          //     `Register Device ${prodNumber}`,
          //     resp.status,
          //     resp.message
          //   );
        },
        error: (resp) => {
          console.log(resp);

          progress.add = false;
          this.setState({ ...this.state, progress });

          this.putToast(
            `Register Device ${prodNumber}`,
            false,
            resp.responseJSON.message
              ? resp.responseJSON.message
              : "Something went wrong."
          );
        },
      });
    } else {
      this.putToast("Empty Field.", false, "Please Enter Production Number.");
    }
  };

  verifyDevice = (e) => {
    e.preventDefault();

    let accessToken = this.props.accessToken;
    let { prodNumber } = this.state;

    if (prodNumber) {
      let { progress } = this.state;
      progress.verify = true;
      this.setState({ ...this.state, progress });

      let data = JSON.stringify({
        production_number: prodNumber,
      });

      $.ajax({
        method: "POST",
        url: BASE_URL + "/api/hardware/verify/",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        data,
        dataType: "json",
        success: (resp) => {
          progress.verify = false;
          this.setState({ ...this.state, progress });

          this.putToast(
            `Verify Device ${prodNumber}`,
            resp.status,
            resp.message
          );
        },
        error: (resp) => {
          console.log(resp);

          progress.verify = false;
          this.setState({ ...this.state, progress });

          if (resp.status === 404) {
            this.putToast(
              `Verify Device ${prodNumber}`,
              resp.responseJSON.status,
              resp.responseJSON.message
            );
          } else {
            swal({
              title: "Something went wrong.",
              icon: "error",
            });
          }
        },
      });
    } else {
      this.putToast("Empty Field.", false, "Please Enter Production Number.");
    }
  };

  getRegisterBtnText = () => {
    let { progress } = this.state;

    if (progress.add) {
      return (
        <React.Fragment>
          <div className="vertical-center" style={{ minHeight: 0 }}>
            <Spinner
              animation="border"
              size="sm"
              as="span"
              role="status"
              style={{ marginRight: "5px" }}
            >
              <span className="sr-only">Progress</span>
            </Spinner>
            Registering
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Register</React.Fragment>;
    }
  };

  getVerifyBtnText = () => {
    let { progress } = this.state;

    if (progress.verify) {
      return (
        <React.Fragment>
          <div className="vertical-center" style={{ minHeight: 0 }}>
            <Spinner
              animation="border"
              size="sm"
              as="span"
              role="status"
              style={{ marginRight: "5px" }}
            >
              <span className="sr-only">Progress</span>
            </Spinner>
            Verifying
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Verify</React.Fragment>;
    }
  };

  render() {
    return (
      <React.Fragment>
        <Card style={cardStyle}>
          <Card.Body>
            <h3
              style={{ textAlign: "center" }}
              onClick={() => this.setState({ ...this.state, prodNumber: "" })}
            >
              Register Hardware
            </h3>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                alt="addhardware"
                src={hardwareRegister}
                style={{ width: "70%" }}
              />
            </div>
            <br />
            <Form>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">
                    Production Number
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  placeholder="Enter Production Number"
                  type="number"
                  onChange={this.updateProductionNumber}
                  value={this.state.prodNumber}
                  required
                />
              </InputGroup>
              <div className="container" style={buttonContainer}>
                <Button
                  variant="info"
                  onClick={this.registerHardware}
                  disabled={this.state.progress.add}
                >
                  {this.getRegisterBtnText()}
                </Button>
                <Button
                  variant="outline-info"
                  style={{ marginLeft: "10px" }}
                  onClick={this.verifyDevice}
                  disabled={this.state.progress.verify}
                >
                  {this.getVerifyBtnText()}
                </Button>
              </div>
            </Form>
            {/* <Modal
              aria-labelledby="conatined-modal-title-vcenter"
              centered
              show={this.state.qrcodeModalShow}
            >
              <Modal.Body>
                <Qrcode />
              </Modal.Body>
            </Modal> */}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.credentials.tokens.accessToken,
});

export default connect(mapStateToProps, {})(AddHardware);
