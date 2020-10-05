import React, { Component } from "react";
import {
  Button,
  InputGroup,
  Row,
  Col,
  Form,
  Card,
  Table,
  Modal,
  FormControl,
  Dropdown,
  Spinner,
  Toast,
} from "react-bootstrap";
import { connect } from "react-redux";
import swal from "sweetalert";

import $ from "jquery";

import { BASE_URL } from "../baseValues";
// import searching from "../assets/images/searching.png";
import searching from "../assets/images/search.svg";
// import loading from '../assets/images/loading.gif';

const cardStyle = {
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px 0px #000",
  width: "270rem",
  // height: '35rem'
};

const buttonStyle = {
  display: "flex",
  justifyContent: "center",
};

const deleteStyle = {
  // color: 'red',
  cursor: "pointer",
};

const editStyle = {
  // color: '#07adfa',
  marginLeft: "10px",
  cursor: "pointer",
};

var timeout;

class Search extends Component {
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
        search: false,
        edit: false,
        delete: false,
        deleteDevice: "",
      },
      editModalShow: false,
      moreInfoModalShow: false,
      productionNumber: "",
      registeredDate: "",
      searchDeviceList: [],
      activeDeviceIndex: 0,
      searchOption: "productionNumber",
      pagination: {
        count: "",
        next: "",
        previous: "",
        totalPage: "",
        activePage: 1,
      },
    };
  }

  updateProductNumber = (e) => {
    this.setState({ ...this.state, productionNumber: e.target.value });
  };

  updateRegisteredDate = (e) => {
    this.setState({ ...this.state, registeredDate: e.target.value });
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

  putToast = (header, status, message) => {
    let { toast } = this.state;

    toast.show = true;
    toast.header = header;
    toast.status = status;
    toast.message = message;

    this.setState({ ...this.state, toast }, () => this.removeToast());
  };

  getHardware = (paginate = null) => {
    let accessToken = this.props.access;
    let {
      productionNumber,
      registeredDate,
      pagination,
      searchOption,
    } = this.state;

    let data = null;
    let url = BASE_URL + "/api/hardware/crud/";

    if (paginate === "next") {
      url = pagination.next;
    } else if (paginate === "prev") {
      url = pagination.previous;
    } else if (searchOption === "productionNumber") {
      if (productionNumber) {
        data = { search: productionNumber };
      } else {
        this.putToast("Empty Field.", false, "Please Enter Production Number.");
        return false;
      }
    } else if (searchOption === "registeredDate") {
      if (registeredDate) {
        data = { registered: registeredDate };
      } else {
        this.putToast("Empty Field.", false, "Please Select Registered Date.");
        return false;
      }
    } else if (searchOption === "byMyself") {
      data = { by: this.props.user.id };
    }

    let { progress } = this.state;
    progress.search = true;
    this.setState({ ...this.state, progress });

    $.ajax({
      method: "GET",
      url,
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      data,
      dataType: "json",
      success: (resp) => {
        progress.search = false;
        this.setState({ ...this.state, progress });

        if (resp.results.length > 0) {
          if (resp.count) {
            pagination.count = resp.count;
            pagination.next = resp.next;
            pagination.previous = resp.previous;

            let total = pagination.count / 10;
            let integer = Math.floor(total);

            if (total > integer) {
              total = integer + 1;
            } else {
              total = integer;
            }

            pagination.totalPage = total;

            if (resp.next) {
              pagination.activePage =
                parseInt(resp.next[resp.next.length - 1]) - 1;
            } else if (resp.previous) {
              if (resp.previous.indexOf("page=") === -1) {
                pagination.activePage = 2;
              } else {
                let previousPage = parseInt(
                  resp.previous[resp.previous.length - 1]
                );

                pagination.activePage = previousPage + 1;
              }
            } else {
              pagination.activePage = 1;
            }
          }

          this.setState({
            ...this.state,
            searchDeviceList: resp.results,
            pagination,
          });
        } else {
          progress.search = false;
          this.setState({ ...this.state, progress });

          this.putToast("Search", false, "No Device Found!");
        }
      },
      error: (resp) => {
        progress.search = false;
        this.setState({ ...this.state, progress });

        console.log(resp);
        let text;

        try {
          text = resp.responseJSON.message
            ? resp.responseJSON.message
            : "Something went wrong.";
        } catch (e) {
          console.log(e);
          text = "Something went wrong.";
        }

        swal({
          text,
          icon: "error",
        });
      },
    });
  };

  getHardwareRegisteredByMe = () => {
    this.setState(
      { ...this.state, searchOption: "byMyself", searchDeviceList: [] },
      () => this.getHardware()
    );
  };

  getDeviceIndexFromState = (deviceID) => {
    let { searchDeviceList } = this.state;

    let returnDevice = searchDeviceList.filter((device) => {
      return device.device_id === deviceID;
    });

    return searchDeviceList.indexOf(returnDevice[0]);
  };

  newProductionNumber = (e) => {
    let { searchDeviceList } = this.state;
    searchDeviceList[this.state.activeDeviceIndex].production_number =
      e.target.value;
    this.setState({ ...this.state, searchDeviceList });
  };

  showEditModal = () => {
    let { searchDeviceList, activeDeviceIndex } = this.state;

    let proceed =
      searchDeviceList[activeDeviceIndex].registered_by.id ===
      this.props.user.id;

    if (proceed) {
      this.setState({ ...this.state, editModalShow: true, activeDeviceIndex });
    } else {
      swal({
        title: "Unauthorized",
        text: "You cannot edit hardware registered by other registrars!",
        icon: "warning",
      });
    }
  };

  updateHardwareInfo = () => {
    let { progress } = this.state;
    progress.edit = true;
    this.setState({ ...this.state, progress });

    let accessToken = this.props.access;

    let { searchDeviceList, activeDeviceIndex } = this.state;

    let productionNumber =
      searchDeviceList[activeDeviceIndex].production_number;
    let device_id = searchDeviceList[activeDeviceIndex].device_id;

    if (productionNumber) {
      let data = JSON.stringify({
        production_number: productionNumber,
      });

      $.ajax({
        method: "PUT",
        url: BASE_URL + `/api/hardware/crud/${device_id}`,
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        data,
        dataType: "json",
        success: (resp) => {
          progress.edit = false;
          this.setState({ ...this.state, progress, editModalShow: false });

          this.putToast(`Edit Device ${productionNumber}`, true, resp.message);
        },
        error: (resp) => {
          console.log(resp);

          progress.edit = false;
          this.setState({ ...this.state, progress, editModalShow: false });

          let message = resp.responseJSON.message
            ? resp.responseJSON.message
            : "Something went wrong.";
          this.putToast(`Edit Device ${productionNumber}`, false, message);
        },
      });
    } else {
      this.putToast(
        "Empty Field",
        false,
        "Please Enter New Production Number."
      );
    }
  };

  deleteHardware = () => {
    let accessToken = this.props.access;
    let { searchDeviceList, activeDeviceIndex } = this.state;
    let device_id = searchDeviceList[activeDeviceIndex].device_id;
    let proceed =
      searchDeviceList[activeDeviceIndex].registered_by.id ===
      this.props.user.id;

    if (proceed) {
      swal({
        title: "Are You Sure You Want To Delete This Device?",
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: {
            visible: true,
            value: false,
            text: "No",
          },
          confirm: {
            visible: true,
            value: true,
            text: "Yes",
          },
        },
      }).then((val) => {
        if (val) {
          let { progress } = this.state;
          progress.delete = true;
          progress.deleteDevice = device_id;
          this.setState({ ...this.state, progress });

          $.ajax({
            method: "DELETE",
            url: BASE_URL + `/api/hardware/crud/${device_id}`,
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
            success: (resp) => {
              progress.delete = false;
              progress.deleteDevice = "";
              this.setState({ ...this.state, progress });

              this.props.updateHardwareInfo();

              let index = this.getDeviceIndexFromState(device_id);
              let { searchDeviceList } = this.state;

              searchDeviceList.splice(index, 1);
              this.setState({ ...this.state, searchDeviceList });

              this.putToast("Delete Device", true, resp.message);
            },
            error: (resp) => {
              console.log(resp);

              progress.delete = false;
              progress.deleteDevice = "";
              this.setState({ ...this.state, progress });

              let message = resp.responseJSON
                ? resp.responseJSON.message
                : "Something went wrong.";
              this.putToast("Delete Device", false, message);
            },
          });
        }
      });
    } else {
      swal({
        title: "Unauthorized",
        text: "You cannot delete hardware registered by other registrars!",
        icon: "warning",
      });
    }
  };

  getImageOrTable = () => {
    let { searchDeviceList, searchOption } = this.state;

    if (searchDeviceList.length === 0) {
      return (
        <React.Fragment>
          <div className="text-center">
            <img alt="search" src={searching} style={{ width: "40%" }} />
          </div>
        </React.Fragment>
      );
    } else {
      if (searchOption === "productionNumber") {
        return (
          <React.Fragment>
            <Table responsive style={{ textAlign: "center" }}>
              <tbody>
                <tr>
                  <th>Device ID</th>
                  <td>{searchDeviceList[0].device_id}</td>
                </tr>
                <tr>
                  <th>Production Number</th>
                  <td>{searchDeviceList[0].production_number}</td>
                </tr>
                <tr>
                  <th>Registered By</th>
                  <td>{searchDeviceList[0].registered_by.username}</td>
                </tr>
                <tr>
                  <th>Registered On</th>
                  <td>{searchDeviceList[0].registered_on}</td>
                </tr>
                <tr>
                  <th>Updated By</th>
                  <td>{searchDeviceList[0].updated_by.username}</td>
                </tr>
                <tr>
                  <th>Updated On</th>
                  <td>{searchDeviceList[0].updated_on}</td>
                </tr>
              </tbody>
            </Table>
            <div style={buttonStyle}>
              <Button
                variant="primary"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  this.setState({ ...this.state, activeDeviceIndex: 0 }, () =>
                    this.showEditModal()
                  );
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={this.deleteHardware}
                disabled={this.state.progress.delete}
              >
                {this.getDeleteBtnText()}
              </Button>
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <div style={{ overflowY: "auto", height: "25rem" }}>
              <Table responsive style={{ textAlign: "center" }}>
                <tbody>
                  <tr>
                    <th>Device ID</th>
                    <th>Production Number</th>
                    <th>Registered By</th>
                    <th>Registered Date</th>
                    <th></th>
                  </tr>
                  {searchDeviceList.map((device) => (
                    <tr key={device.device_id}>
                      <td>{device.device_id}</td>
                      <td>{device.production_number}</td>
                      <td>{device.registered_by.username}</td>
                      <td>{device.registered_on}</td>
                      <td>
                        {this.getDeleteIcon(device)}
                        <i
                          className="fas fa-edit color-blue"
                          style={editStyle}
                          onClick={() =>
                            this.setState(
                              {
                                ...this.state,
                                activeDeviceIndex: this.getDeviceIndexFromState(
                                  device.device_id
                                ),
                              },
                              () =>
                                this.setState({
                                  ...this.state,
                                  editModalShow: true,
                                })
                            )
                          }
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Row>
                <Col sm={4}>
                  <Button
                    variant="secondary"
                    onClick={() => this.getHardware("prev")}
                    size="sm"
                    disabled={this.state.pagination.previous ? false : true}
                  >
                    Previous
                  </Button>
                </Col>
                <Col sm={4}>
                  <div className="text-center">
                    Page {this.state.pagination.activePage} of{" "}
                    {this.state.pagination.totalPage}
                  </div>
                </Col>
                <Col sm={4}>
                  <Button
                    variant="secondary"
                    onClick={() => this.getHardware("next")}
                    size="sm"
                    style={{ float: "right" }}
                    disabled={this.state.pagination.next ? false : true}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        );
      }
    }
  };

  getSearchField = () => {
    let { searchOption } = this.state;

    if (searchOption === "productionNumber") {
      return (
        <React.Fragment>
          <Form.Control
            placeholder="Production number"
            aria-label="Production Number"
            aria-describedby="basic-addon1"
            type="number"
            onChange={this.updateProductNumber}
            value={this.state.productionNumber}
            required
          />
        </React.Fragment>
      );
    } else if (searchOption === "registeredDate") {
      return (
        <React.Fragment>
          <Form.Control
            placeholder="Registered Date"
            aria-label="Registered Date"
            aria-describedby="basic-addon1"
            type="date"
            onChange={this.updateRegisteredDate}
            value={this.state.registeredDate}
            required
          />
        </React.Fragment>
      );
    } else if (searchOption === "byMyself") {
      return (
        <React.Fragment>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            type="text"
            value={this.props.user.username}
            disabled
            required
          />
        </React.Fragment>
      );
    }
  };

  getToUpdateProductionNumber = () => {
    try {
      return this.state.searchDeviceList[this.state.activeDeviceIndex]
        .production_number;
    } catch {
      return "";
    }
  };

  getSearchBtnText = () => {
    let { progress } = this.state;

    if (progress.search) {
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
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Search</React.Fragment>;
    }
  };

  getEditBtnText = () => {
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
            Saving ...
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Save</React.Fragment>;
    }
  };

  getDeleteBtnText = () => {
    let { progress } = this.state;

    if (progress.delete) {
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
            Deleting ...
          </div>
        </React.Fragment>
      );
    } else {
      return <React.Fragment>Delete</React.Fragment>;
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

  getDeleteIcon = (device) => {
    let { progress } = this.state;

    if (progress.deleteDevice === device.device_id) {
      return (
        <React.Fragment>
          <Spinner
            animation="border"
            variant="danger"
            size="sm"
            as="span"
            role="status"
            style={{ marginRight: "5px" }}
          >
            <span className="sr-only">Progress</span>
          </Spinner>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <i
            className="fas fa-trash color-danger"
            style={deleteStyle}
            onClick={() =>
              this.setState(
                {
                  ...this.state,
                  activeDeviceIndex: this.getDeviceIndexFromState(
                    device.device_id
                  ),
                },
                () => {
                  this.deleteHardware();
                }
              )
            }
          ></i>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <Toast
          show={this.state.toast.show}
          style={{
            position: "absolute",
            top: "70px",
            right: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px 2px #999",
            zIndex: 2,
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
        <Card style={cardStyle}>
          <Card.Body>
            <span
              onClick={() => {
                this.setState({
                  searchDeviceList: [],
                  productionNumber: "",
                  registeredDate: "",
                  searchOption: "productionNumber",
                });
              }}
            >
              <h3 style={{ textAlign: "center" }}> Search Hardware </h3>
            </span>
            <br />
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <Dropdown>
                    <Dropdown.Toggle
                      className="prepend-dropdown"
                      variant="outline-primary"
                      id="dropdown-basic"
                    >
                      Search By
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            searchOption: "productionNumber",
                            searchDeviceList: [],
                            productionNumber: "",
                          })
                        }
                      >
                        Production Number
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            searchOption: "registeredDate",
                            searchDeviceList: [],
                            registeredDate: "",
                          })
                        }
                      >
                        Registered Date
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.getHardwareRegisteredByMe}>
                        Myself
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup.Prepend>
                {this.getSearchField()}
                <InputGroup.Append>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={this.getHardware}
                    disabled={this.state.progress.search}
                  >
                    {this.getSearchBtnText()}
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
            <hr />
            {this.getImageOrTable()}
          </Card.Body>
        </Card>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.editModalShow}
          onHide={() => this.setState({ ...this.state, editModalShow: false })}
        >
          <Form onSubmit={this.updateHardwareInfo}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Edit Hardware Info
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      Production Number
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder="Enter Production Number"
                    aria-label="Production Number"
                    aria-describedby="basic-addon1"
                    required
                    type="number"
                    value={this.getToUpdateProductionNumber()}
                    onChange={this.newProductionNumber}
                  />
                </InputGroup>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="danger" onClick={() => this.setState({...this.state, editModalShow: false })}>Close</Button> */}
              <Button
                variant="outline-success"
                onClick={() => this.updateHardwareInfo()}
                disabled={this.state.progress.edit}
              >
                {this.getEditBtnText()}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  access: state.credentials.tokens.accessToken,
  user: state.credentials.user,
});

export default connect(mapStateToProps, {})(Search);
