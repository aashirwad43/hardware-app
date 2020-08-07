import React, { Component } from 'react'
import { Button, InputGroup, Form, Card, Table, ButtonToolbar, Modal, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import $ from 'jquery';

import { BASE_URL } from '../baseValues'
import searching from "../assets/images/searching.png";

const cardStyle = {
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    width: '30rem'

};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
}

const photoStyle = {
    height: '250px',
    width: '400px',
}

const imageContainer = {
    display: 'flex',
    justifyContent: 'center',
}

const buttonContainer = {
    display: 'flex',
    justifyContent: 'center',
}

const buttonStyle = {

    display: 'flex',
    justifyContent: 'center'

};

export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editModalShow: false,
            productionNumber: "",
            accessToken: this.props.access,
            searchDeviceList: []
        }
    }

    updateProductNumber = (e) => {
        this.setState({ ...this.state, productionNumber: e.target.value })
    }

    getHardware = (e) => {
        e.preventDefault();

        let { accessToken, productionNumber } = this.state;

        let data = {
            search: productionNumber
        };

        var component = this;

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: function (resp) {
                component.setState({ ...component.state, searchDeviceList: resp.results });
            },
            error: function (resp) {
                console.log(resp)
                if (resp.status === 404) {
                    swal({
                        title: "Device Not Found.",
                        icon: "warning"
                    });
                } else {
                    swal({
                        title: "Something went wrong.",
                        text: "Please try again.",
                        icon: "warning"
                    });
                }
            }
        });

    }

    newProductionNumber = (e) => {
        let { searchDeviceList } = this.state;
        searchDeviceList.production_number = e.target.value
        this.setState({ ...this.state, searchDeviceList });
    }

    updateHardwareInfo = (e) => {
        e.preventDefault();

        let { searchDeviceList, accessToken } = this.state;

        let productionNumber = searchDeviceList.production_number;

        let device_id = searchDeviceList.device_id;

        if (
            (productionNumber)
            &&
            (searchDeviceList.registered_by.id === this.props.userID)
        ) {
            let data = JSON.stringify({
                production_number: productionNumber
            });

            $.ajax({
                method: "PUT",
                url: BASE_URL + `/api/hardware/${device_id}`,
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json'
                },
                data,
                dataType: 'json',
                success: (resp) => {
                    swal({
                        title: "Hardware Info Updated Successfully.",
                        icon: "success"
                    })
                    // .then(() => this.setState({ ...this.state, productionNumber: ''}));
                },
                error: (resp) => {
                    console.log(resp);
                    swal({
                        title: "Something went wrong.",
                        text: "Please try again",
                        icon: "warning"
                    })
                    // <Card.Img src={searching} style={{ height: '289px', width: '400px' }} />
                }
            });
        } else {
            let title = "";
            if (searchDeviceList.registered_by.id === this.props.userID) {
                title = "You cannot update information of device registered by other registrars!"
            } else {
                title = "Please Enter New Production Number."

            }
            swal({
                title,
                icon: "warning"
            })
        }
    }

    deleteHardware = (e) => {
        e.preventDefault();

        let { searchDeviceList, accessToken } = this.state;

        let device_id = searchDeviceList.device_id;

        
        if (searchDeviceList.registered_by.id === this.props.userID) {
            swal({
                title:"Are You Sure You Want To Delete This Device?",
                icon:"warning",
                dangerMode:true,
                buttons:{
                    cancel: {
                        visible: true,
                        value: false,
                        text: "No"
                    },
                    confirm: {
                        visible: true,
                        value: true,
                        text: "Yes"
                    }
                }
            })
           .then(val => {
               if (val) {
                   $.ajax({
                       method: "DELETE",
                       url: BASE_URL + `/api/hardware/${device_id}`,
                       headers: {
                           Authorization: accessToken,
                           'Content-Type': 'application/json'
                       },
                       success: (resp) => {
                           swal({
                               title: "Hardware Deleted Successfully.",
                               icon: "success"
                           }).then(() => this.setState({ ...this.state, searchDeviceList: [], productionNumber: '' }));
                       },
                       error: (resp) => {
                           console.log(resp);
                           swal({
                               title: "Something went wrong.",
                               text: "Please try again",
                               icon: "warning"
                           })
                       }
                   });
               }
           }) 

        }
        else {
            swal({
                title: "Authorization Error.",
                text: "You cannot delete hardware registered by other registrar.",
                icon: "warning"
            })
        }
    }

    getImageOrTable = () => {
        let { searchDeviceList } = this.state;
        let dataExists;

        if (Array.isArray(searchDeviceList)) {
            dataExists = searchDeviceList.length === 0;
        } else {
            dataExists = Object.keys(searchDeviceList).length === 0 && searchDeviceList.constructor === Object;
        }

        if (dataExists) {
            return (
                <React.Fragment>
                    <Card.Img src={searching} style={{ height: '289px', width: '400px' }} />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Table responsive >
                        <tbody>
                            <tr>
                                <td>Device Id</td>
                                <td>{this.state.searchDeviceList.device_id}</td>
                            </tr>
                            <tr>
                                <td>Production Number</td>
                                <td>{this.state.searchDeviceList.production_number}</td>
                            </tr>
                            <tr>
                                <td>Registered By</td>
                                <td>{this.state.searchDeviceList.registered_by.username}</td>
                            </tr>
                            <tr>
                                <td>Registered On</td>
                                <td>{this.state.searchDeviceList.registered_on}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div style={buttonStyle}>
                        <ButtonToolbar>
                            <Button variant="primary" onClick={() => this.setState({ editModalShow: true })}> Edit</Button>
                            <Button variant="danger" style={{ marginLeft: '5px' }} onClick={this.deleteHardware}>Delete</Button>
                            <Modal
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                show={this.state.editModalShow}
                            >
                                <Form onSubmit={this.updateHardwareInfo}>
                                    <Modal.Header closeButton onClick={() => this.setState({ editModalShow: false })}>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                            Edit Hardware Info
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">Production Number</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    placeholder="Enter Production Number"
                                                    aria-label="Production Number"
                                                    aria-describedby="basic-addon1"
                                                    required
                                                    type="number"
                                                    value={this.state.searchDeviceList.production_number}
                                                    onChange={this.newProductionNumber}
                                                />
                                            </InputGroup>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={() => this.setState({ editModalShow: false })}>Close</Button>
                                        <Button variant="success" onClick={() => this.setState({ editModalShow: false })} type="submit">Save Changes</Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        </ButtonToolbar>
                    </div>
                </React.Fragment>
            )
        }
    }

    render() {
        if (this.state.searchDeviceList === null) {

        }
        return (
            <React.Fragment>
                <Card style={cardStyle}>
                    <a onClick={() => { this.setState({ searchDeviceList: [], productionNumber: "" }) }}><h3 style={{ textAlign: 'center' }}> Search Hardware </h3></a>
                    <br />
                    <Form onSubmit={this.getHardware}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Production number"
                                aria-label="Production Number"
                                aria-describedby="basic-addon1"
                                type="number"
                                onChange={this.updateProductNumber}
                                value={this.state.productionNumber}
                                required
                            />
                            <InputGroup.Prepend>
                                <Button variant="success" type="submit">Search</Button>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Form>
                    <br />
                    {this.getImageOrTable()}
                </Card>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    username: state.credentials.user.username,
    access: state.credentials.tokens.accessToken,
    userID: state.credentials.user.id
})

export default connect(mapStateToProps, {})(Search);
