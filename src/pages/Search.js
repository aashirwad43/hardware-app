import React, { Component } from 'react'
import { Button, InputGroup, Form, Card, Table, ButtonToolbar, Modal, FormControl, Dropdown } from 'react-bootstrap';
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
            moreInfoModalShow: false,
            selectedMore: '',
            productionNumber: "",
            registeredDate: "",
            accessToken: this.props.access,
            searchDeviceList: [],
            activeDeviceIndex: 0,
            searchOption: 'productionNumber',
            pagination: {
                next: '',
                previous: ''
            }
        }

    }

    updateProductNumber = (e) => {
        this.setState({ ...this.state, productionNumber: e.target.value })
    }

    updateRegisteredDate = (e) => {
        this.setState({ ...this.state, registeredDate: e.target.value })
    }

    getHardware = (e) => {
        e.preventDefault();

        let { accessToken, productionNumber, registeredDate } = this.state;

        var { searchOption } = this.state;

        let data;

        if (searchOption === 'productionNumber') {
            data = {search: productionNumber}
        }
        else {
            data = {registered: registeredDate}
        }

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
                component.setState({ ...component.state, searchDeviceList: resp.results, pagination: { next: resp.next, previous: resp.previous } });
            },
            error: function (resp) {
                console.log(resp)
                if (resp.status === 404 ) {
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

    getPagination = (e) => {

    }

    getDeviceIndexFromState = (deviceID) => {
        let { searchDeviceList } = this.state;

    
        let returnDevice = searchDeviceList.filter(device => {
            return device.device_id === deviceID;
            
        });
        
        return searchDeviceList.indexOf(returnDevice[0]);
    }

    newProductionNumber = (e) => {
        let { searchDeviceList } = this.state;
        searchDeviceList[this.state.activeDeviceIndex].production_number = e.target.value
        this.setState({ ...this.state, searchDeviceList });
    }

    // newProductionNumberFromDetail = (e) => {
    //     let {  } = this.state;

    // }

    updateHardwareInfo = (e) => {
        e.preventDefault();

        let { searchDeviceList, accessToken, activeDeviceIndex } = this.state;

        let productionNumber = searchDeviceList[activeDeviceIndex].production_number;

        let device_id = searchDeviceList[activeDeviceIndex].device_id;

        if (
            (productionNumber)
            &&
            (searchDeviceList[activeDeviceIndex].registered_by.id === this.props.userID)
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
            if (searchDeviceList[activeDeviceIndex].registered_by.id !== this.props.userID) {
                title = "You cannot update information of device registered by other registrars!"
                
            } else {
                title = "Please Enter New Production Number."
            }
            swal({
                title,
                icon: "warning"
            }).then(() => this.setState({ ...this.state, searchDeviceList: [], productionNumber: ''}));
        }
    }

    deleteHardware = (e) => {
        e.preventDefault();

        let { searchDeviceList, accessToken, activeDeviceIndex } = this.state;

        let device_id = searchDeviceList[activeDeviceIndex].device_id;


        if (searchDeviceList[activeDeviceIndex].registered_by.id === this.props.userID) {
            swal({
                title: "Are You Sure You Want To Delete This Device?",
                icon: "warning",
                dangerMode: true,
                buttons: {
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
        let { searchDeviceList, selectedMore, searchOption } = this.state;

        // const filteredDetailInfo = searchDeviceList.filter((item) => {
        //     return item.device_id === selectedMore
        // })

        if (searchDeviceList.length === 0) {
            return (
                <React.Fragment>
                    <Card.Img src={searching} style={{ height: '289px', width: '400px' }} />
                </React.Fragment>
            )
        } else {
            if (searchOption === "productionNumber"){
                return (
                    <React.Fragment>
                        <Table responsive >
                            <tbody>
                                <tr>
                                    <td>Device Id</td>
                                    <td>{searchDeviceList[0].device_id}</td>
                                </tr>
                                <tr>
                                    <td>Production Number</td>
                                    <td>{searchDeviceList[0].production_number}</td>
                                </tr>
                                <tr>
                                    <td>Registered By</td>
                                    <td>{searchDeviceList[0].registered_by.username}</td>
                                </tr>
                                <tr>
                                    <td>Registered On</td>
                                    <td>{searchDeviceList[0].registered_on}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div style={buttonStyle}>
                            <ButtonToolbar>
                                <Button variant="primary" onClick={() => this.setState({...this.state, editModalShow: true, activeDeviceIndex: 0})}> Edit</Button>
                                <Button variant="danger" style={{ marginLeft: '5px' }} onClick={this.deleteHardware}>Delete</Button>
                                
                            </ButtonToolbar>
                        </div>
                    </React.Fragment>
                )
            }
            else if (searchOption === "registeredDate") {
                return(
                    <React.Fragment>
                        <Table responsive >
                            <tbody>
                                <tr>
                                    <th>Production Number</th>
                                    <th>Registered Date</th>
                                    <th></th>
                                </tr>
                                {searchDeviceList.map(device => (
                                    <tr key={device.device_id}>
                                        <td>{device.production_number}</td>
                                        <td>{device.registered_on}</td>
                                        <td> <Button variant="primary" onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, moreInfoModalShow: true}))}> More </Button></td>
                                        <Modal
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        show={this.state.moreInfoModalShow}
                                        >
                                            <Card>
                                                <Modal.Header closeButton onClick={() => this.setState({...this.state, moreInfoModalShow: false })}>
                                                    <Modal.Title id="contained-modal-title-vcenter">
                                                        Detail Info
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>
                                                        <Table responsive >
                                                            <tbody>
                                                                <tr>
                                                                    <td>Device Id</td>
                                                                    <td>{this.state.searchDeviceList[this.state.activeDeviceIndex].device_id}</td>    
                                                                </tr>
                                                                <tr>
                                                                    <td>Production Number</td>
                                                                    <td>{this.state.searchDeviceList[this.state.activeDeviceIndex].production_number}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Registered By</td>
                                                                    <td>{this.state.searchDeviceList[this.state.activeDeviceIndex].registered_by.username}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Registered On</td>
                                                                    <td>{this.state.searchDeviceList[this.state.activeDeviceIndex].registered_on}</td>
                                                                </tr>    
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="primary" onClick={() => this.setState({...this.state, editModalShow: true})} type="submit">Edit</Button>
                                                    <Button variant="danger" onClick={() => this.setState({...this.state, moreInfoModalShow: false })}>Close</Button>
                                                </Modal.Footer>
                                            </Card>
                                        </Modal>
                                    </tr>    
                                ))}
                            </tbody>
                            <Button variant={}>Next</Button>
                            <Button>Next</Button>
                        </Table>
                    </React.Fragment>    
                )
            }
            
        }
    }

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
            )
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
                        required />
                </React.Fragment>
            )
        }
    }

    getToUpdateProductionNumber = () => {
        try{
            return this.state.searchDeviceList[this.state.activeDeviceIndex].production_number
        }
        catch{
            return '' ;
        }
        
    }

    render() {
        return (
            <React.Fragment>
                <Card style={cardStyle}>
                    <a onClick={() => { this.setState({ searchDeviceList: [], productionNumber: "", registeredDate: "" }) }}><h3 style={{ textAlign: 'center' }}> Search Hardware </h3></a>
                    <br />
                    <Form onSubmit={this.getHardware}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Search By
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={ () => this.setState({...this.state, searchOption:"productionNumber", searchDeviceList:[], productionNumber: ""}) }>Production Number</Dropdown.Item>
                                        <Dropdown.Item onClick={ () => this.setState({...this.state, searchOption:"registeredDate", searchDeviceList:[], registeredDate: ""}) }>Registered Date</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup.Prepend>
                            { this.getSearchField() }
                            <InputGroup.Append>
                                <Button variant="success" type="submit">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    <br />
                    {this.getImageOrTable()}
                </Card>
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.editModalShow}
                >
                    <Form onSubmit={this.updateHardwareInfo}>
                        <Modal.Header closeButton onClick={() => this.setState({...this.state, editModalShow: false })}>
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
                                        value={this.getToUpdateProductionNumber()}
                                        onChange={this.newProductionNumber}
                                    />
                                </InputGroup>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => this.setState({...this.state, editModalShow: false })}>Close</Button>
                            <Button variant="success" onClick={() => this.setState({...this.state, editModalShow: false })} type="submit">Save Changes</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
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
