import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import swal from "sweetalert";

import { setAuthCred, setHardwareInfo } from "../actions";
import { saveToLocalStorage } from "../localStorage";

import AddHardware from "./AddHardware";
import HardwareInfo from "./HardwareInfo";

import { BASE_URL, EXPIRY } from "../baseValues";
import { Row, Col, Toast } from "react-bootstrap";

var timeout;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toast: {
        show: false,
        header: "",
        status: false,
        message: "",
      },
    };
  }
  componentDidMount() {
    this.getUserID();
    this.getHardwareInfo();

    setInterval(() => {
      let { expiry } = this.props.reduxValue.credentials.tokens;
      let now = Date.now();

      if (now >= expiry) {
        this.refreshToken();
      }
    }, 60 * 1000); // Check every minute
  }

  refreshToken = () => {
    let reduxValue = this.props.reduxValue;

    let data = JSON.stringify({
      refresh: reduxValue.credentials.tokens.refreshToken,
    });

    $.ajax({
      method: "POST",
      url: BASE_URL + "/api/auth/token/refresh/",
      data,
      headers: {
        "Content-Type": "application/json",
      },
      success: (resp) => {
        let expiryTime = EXPIRY();
        reduxValue.credentials.tokens.expiry = expiryTime;
        reduxValue.credentials.tokens.accessToken = `Bearer ${resp.access}`;

        saveToLocalStorage(reduxValue);

        this.props.setAuthCred(reduxValue.credentials);
      },
      error: (e) => console.log(e),
    });
  };

  getUserID = () => {
    let reduxValue = this.props.reduxValue;

    delete reduxValue.hardwareInfo;

    let { accessToken } = reduxValue.credentials.tokens;
    let { username } = reduxValue.credentials.user;

    let data = { username };

    $.ajax({
      method: "GET",
      url: BASE_URL + "/api/user/self/",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      data,
      dataType: "json",
      success: (resp) => {
        reduxValue.credentials.user.id = resp.results.id;
        this.props.setAuthCred(reduxValue.credentials);
      },
      error: (resp) => {
        console.log(resp);
        localStorage.removeItem("state");
      },
    });
  };

  getHardwareInfo = () => {
    let { accessToken } = this.props.reduxValue.credentials.tokens;

    $.ajax({
      method: "GET",
      url: BASE_URL + "/api/hardware/data/",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      dataType: "json",
      success: (resp) => {
        let result = resp.results.device_registered;

        this.props.setHardwareInfo(result);
      },
      error: function (resp) {
        console.log(resp);
        swal({
          title: "Unable to fetch device data.",
          // text: "Please try again.",
          icon: "warning",
        });
      },
    });
  };

  putToast = (header, status, message) => {
    let { toast } = this.state;

    toast.show = true;
    toast.header = header;
    toast.status = status;
    toast.message = message;

    this.setState({ ...this.state, toast }, () => this.removeToast());
  };

  getToastIconClassName = () => {
    let { status } = this.state.toast;

    if (status) {
      return "fas fa-check-circle color-green fa-lg";
    } else {
      return "fas fa-times-circle color-danger fa-lg";
    }
  };

  removeToast = () => {
    let { toast } = this.state;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      toast.show = false;
      this.setState({ ...this.state, toast });
    }, 5 * 1000); // 5 seconds
  };

  removeToastImmediate = () => {
    let { toast } = this.state;

    toast.show = false;
    this.setState({ ...this.state, toast });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop: "7vh" }}>
          <Toast
            show={this.state.toast.show}
            style={{
              position: "fixed",
              top: "70px",
              right: "0",
              left: "0",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px 2px #999",
              zIndex: 2,
              marginLeft: "auto",
              marginRight: "auto",
              height: "110px",
              width: "310px",
            }}
            onClose={() => this.removeToastImmediate()}
          >
            <Toast.Header>
              <div className="vertical-center" style={{ minHeight: 0 }}>
                <i
                  className={this.getToastIconClassName()}
                  style={{ marginRight: "5px" }}
                ></i>
                <strong className="mr-auto">{this.state.toast.header}</strong>
              </div>
            </Toast.Header>
            <Toast.Body>
              <div className="text-center">
                <b>{this.state.toast.message}</b>
              </div>
            </Toast.Body>
          </Toast>
          <Row>
            <Col sm={4} className="margin-card">
              <HardwareInfo />
            </Col>
            <Col sm={8} className="margin-card">
              <AddHardware
                updateHardwareInfo={this.getHardwareInfo}
                putToast={this.putToast}
              />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  reduxValue: state,
});

export default connect(mapStateToProps, { setAuthCred, setHardwareInfo })(Home);
