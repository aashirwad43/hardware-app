import React, { Component } from "react";
import {
  Form,
  Button,
  ButtonToolbar,
  Table,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
  Toast,
} from "react-bootstrap";
import { connect } from "react-redux";
import $ from "jquery";
import swal from "sweetalert";

import { setAuthCred } from "../actions";
import { BASE_URL } from "../baseValues";

// import loading from '../assets/images/loading.gif';
import user from "../assets/images/user.svg";

const formStyle = {
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px 0px #000",
};

const buttonStyle = {
  display: "flex",
  justifyContent: "center",
};

const photoDivStyle = {
  display: "flex",
  justifyContent: "center",
};

// const photoStyle = {
//     width: '150px'
// };

const defaultPasswordState = {
  newPassword: "",
  confirmNewPassword: "",
};

var timeout;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toast: {
        show: false,
        header: "",
        status: false,
        message: "",
      },
      progress: {
        edit: false,
        password: false,
      },
      editModalShow: false,
      changepasswordModalShow: false,
      userInfo: {},
      password: defaultPasswordState,
    };
  }

  componentDidMount() {
    let accessToken = this.props.credentials.tokens.accessToken;

    let username = this.props.credentials.user.username;

    let data = {
      username,
    };

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
        this.setState({ ...this.state, userInfo: resp.results });
      },
      error: function (resp) {
        console.log(resp);
        swal({
          title: "Unable to fetch your user data.",
          text: "Please try again.",
          icon: "warning",
        });
      },
    });
  }

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

  putToast = (header, status, message) => {
    let { toast } = this.state;

    toast.show = true;
    toast.header = header;
    toast.status = status;
    toast.message = message;

    this.setState({ ...this.state, toast }, () => this.removeToast());
  };

  newFirstName = (e) => {
    let { userInfo } = this.state;
    userInfo.first_name = e.target.value;
    this.setState({ ...this.state, userInfo });
  };

  newLastName = (e) => {
    let { userInfo } = this.state;
    userInfo.last_name = e.target.value;
    this.setState({ ...this.state, userInfo });
  };

  newEmail = (e) => {
    let { userInfo } = this.state;
    userInfo.email = e.target.value;
    this.setState({ ...this.state, userInfo });
  };

  newUsername = (e) => {
    let { userInfo } = this.state;
    userInfo.username = e.target.value;
    this.setState({ ...this.state, userInfo });
  };

  newPhone = (e) => {
    let { userInfo } = this.state;
    userInfo.phone = e.target.value;
    this.setState({ ...this.state, userInfo });
  };

  updateUserInfo = (e) => {
    e.preventDefault();

    let { userInfo, progress } = this.state;
    // let id = userInfo.id;
    let data = JSON.stringify(userInfo);
    let reduxValue = this.props.credentials;
    let accessToken = reduxValue.tokens.accessToken;

    progress.edit = true;
    this.setState({ ...this.state, progress });

    $.ajax({
      method: "PUT",
      url: BASE_URL + "/api/user/self/edit/",
      //   url: BASE_URL + `/api/user/self/edit/${id}`,
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      data,
      dataType: "json",
      success: (resp) => {
        progress.edit = false;
        this.setState({ ...this.state, progress, editModalShow: false });

        reduxValue.user.username = resp.results.username;
        this.props.setAuthCred(reduxValue);

        this.putToast("Update Profile.", resp.status, resp.message);
      },
      error: (resp) => {
        progress.edit = false;
        this.setState({ ...this.state, progress });

        console.log(resp);
        this.putToast("Something went wrong.", false, "Please try again.");
      },
    });
  };

  updatedNewPassword = (e) => {
    let { password } = this.state;
    password.newPassword = e.target.value;
    this.setState({ ...this.state, password });
  };

  updatedConfirmNewPassword = (e) => {
    let { password } = this.state;
    password.confirmNewPassword = e.target.value;
    this.setState({ ...this.state, password });
  };

  updateUserPassword = (e) => {
    e.preventDefault();

    let accessToken = this.props.credentials.tokens.accessToken;
    let { password, progress } = this.state;
    let { confirmNewPassword, newPassword } = password;

    let data = JSON.stringify({
      password: confirmNewPassword,
    });

    if (newPassword === confirmNewPassword) {
      progress.password = true;
      this.setState({ ...this.state, progress });

      $.ajax({
        method: "POST",
        url: BASE_URL + "/api/user/password/",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        data,
        dataType: "json",
        success: (resp) => {
          progress.password = false;
          this.setState({
            ...this.state,
            progress,
            changepasswordModalShow: false,
          });

          this.putToast("Update Password.", resp.status, resp.message);

          this.setState({ ...this.state, password: defaultPasswordState });
        },
        error: (resp) => {
          console.log(resp);

          progress.password = false;
          this.setState({ ...this.state, progress });

          this.putToast("Something went wrong.", false, "Please try again.");
        },
      });
    } else {
      this.putToast("Update Password.", false, "Password Did Not Match!");

      this.setState({ ...this.state, password: defaultPasswordState });
    }
  };

  getToastIconClassName = () => {
    let { status } = this.state.toast;

    if (status) {
      return "fas fa-check-circle color-green fa-lg";
    } else {
      return "fas fa-times-circle color-danger fa-lg";
    }
  };

  getProfileEditBtnText = () => {
    let { progress } = this.state;

    if (progress.edit) {
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
            Saving
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Save</React.Fragment>;
    }
  };

  getPasswordEditBtnText = () => {
    let { progress } = this.state;

    if (progress.password) {
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
            Updating
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Update</React.Fragment>;
    }
  };

  render() {
    return (
      <React.Fragment>
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
        <div className="container-fluid" style={{ marginTop: "15vh" }}>
          <div className="row justify-content-center">
            <div className="col-10 col-sm-6 col-md-6">
              <div className="form-container" style={formStyle}>
                {/* <h3 style={{ textAlign: 'center' }}>Profile</h3> */}
                <div style={photoDivStyle}>
                  <img alt="user" src={user} style={{ width: "25%" }}></img>
                </div>
                <br />
                <div className="container" style={{ textAlign: "center" }}>
                  <Table responsive>
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>
                          {this.state.userInfo.first_name}{" "}
                          {this.state.userInfo.last_name}
                        </td>
                      </tr>
                      <tr>
                        <td>Username</td>
                        <td>{this.state.userInfo.username}</td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>{this.state.userInfo.email}</td>
                      </tr>
                      <tr>
                        <td>Phone no</td>
                        <td>{this.state.userInfo.phone}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div style={buttonStyle}>
                  <ButtonToolbar>
                    <Button
                      variant="primary"
                      style={{ marginRight: "5px" }}
                      onClick={() => this.setState({ editModalShow: true })}
                    >
                      {" "}
                      Edit Info{" "}
                    </Button>
                    <Modal
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      show={this.state.editModalShow}
                    >
                      <Form onSubmit={this.updateUserInfo}>
                        <Modal.Header
                          closeButton
                          onClick={() =>
                            this.setState({ editModalShow: false })
                          }
                        >
                          <Modal.Title id="contained-modal-title-vcenter">
                            Edit Profile Info
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <InputGroup className="mb-3">
                              <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                  First Name
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                placeholder="Enter First Name"
                                aria-label="First Name"
                                aria-describedby="basic-addon1"
                                required
                                type="text"
                                value={this.state.userInfo.first_name}
                                onChange={this.newFirstName}
                              />
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                  Last Name
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                placeholder="Enter Last Name"
                                aria-label="Last Name"
                                aria-describedby="basic-addon1"
                                required
                                type="text"
                                value={this.state.userInfo.last_name}
                                onChange={this.newLastName}
                              />
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                  Username
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                placeholder="Enter Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                required
                                type="text"
                                value={this.state.userInfo.username}
                                onChange={this.newUsername}
                              />
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                  Email
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                placeholder="Enter Email Address"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                // required
                                type="email"
                                value={this.state.userInfo.email}
                                onChange={this.newEmail}
                              />
                            </InputGroup>
                            <InputGroup className="mb-3">
                              <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                  Phone no
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                placeholder="Enter Phone Number"
                                aria-label="Phone no"
                                aria-describedby="basic-addon1"
                                required
                                type="number"
                                value={this.state.userInfo.phone}
                                onChange={this.newPhone}
                              />
                            </InputGroup>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          {/* <Button variant="danger" onClick={() => this.setState({ editModalShow: false })}>Close</Button> */}
                          <Button
                            variant="outline-success"
                            type="submit"
                            disabled={this.state.progress.edit}
                          >
                            {this.getProfileEditBtnText()}
                          </Button>
                        </Modal.Footer>
                      </Form>
                    </Modal>
                  </ButtonToolbar>
                  <ButtonToolbar>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        this.setState({ changepasswordModalShow: true })
                      }
                    >
                      {" "}
                      Change Password{" "}
                    </Button>
                    <Modal
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      show={this.state.changepasswordModalShow}
                    >
                      <Form onSubmit={this.updateUserPassword}>
                        <Modal.Header
                          closeButton
                          onClick={() =>
                            this.setState({ changepasswordModalShow: false })
                          }
                        >
                          <Modal.Title id="contained-modal-title-vcenter">
                            Change Password
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                New Password
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Enter New Password"
                              aria-label="New Password"
                              aria-describedby="basic-addon1"
                              type="password"
                              required
                              value={this.state.password.newPassword}
                              onChange={this.updatedNewPassword}
                            />
                          </InputGroup>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                Confirm Password
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Re-enter New Password"
                              aria-label="Confirm Password"
                              aria-describedby="basic-addon1"
                              type="password"
                              required
                              value={this.state.password.confirmNewPassword}
                              onChange={this.updatedConfirmNewPassword}
                            />
                          </InputGroup>
                        </Modal.Body>
                        <Modal.Footer>
                          {/* <Button variant="danger" onClick={() => this.setState({ changepasswordModalShow: false })}>Close</Button> */}
                          <Button
                            variant="outline-success"
                            type="submit"
                            disabled={this.state.progress.delete}
                          >
                            {this.getPasswordEditBtnText()}
                          </Button>
                        </Modal.Footer>
                      </Form>
                    </Modal>
                  </ButtonToolbar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.credentials,
});

export default connect(mapStateToProps, { setAuthCred })(Profile);
