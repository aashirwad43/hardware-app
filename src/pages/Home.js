import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import swal from "sweetalert";

import { setAuthCred, setHardwareInfo } from "../actions";
import { saveToLocalStorage } from "../localStorage";

import AddHardware from "./AddHardware";
import HardwareInfo from "./HardwareInfo";

import { BASE_URL, EXPIRY } from "../baseValues";
import { Row, Col } from "react-bootstrap";

class Home extends Component {
  componentDidMount() {
    this.getUserID();
    this.getHardwareInfo();

    setInterval(() => {
      let { expiry } = this.props.reduxValue.credentials.tokens;
      let now = Date.now();

      if (now >= expiry) {
        this.refreshToken();
      }
    }, 10 * 1000); // Check every 5 minutes
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

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ marginTop: "7vh" }}>
          <Row>
            <Col sm={3} className="margin-card">
              <HardwareInfo />
            </Col>
            <Col sm={9} className="margin-card">
              <AddHardware updateHardwareInfo={this.getHardwareInfo} />
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
