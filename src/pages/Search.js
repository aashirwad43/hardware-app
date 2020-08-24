import React, { Component } from 'react'
import { Button, InputGroup, Row, Col, Form, Card, Table, ButtonToolbar, Modal, FormControl, Dropdown } from 'react-bootstrap';
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

// const containerStyle = {
//     display: 'flex',
//     justifyContent: 'center',
// }

// const photoStyle = {
//     height: '250px',
//     width: '400px',
// }

// const imageContainer = {
//     display: 'flex',
//     justifyContent: 'center',
// }

// const buttonContainer = {
//     display: 'flex',
//     justifyContent: 'center',
// }

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
            productionNumber: "",
            registeredDate: "",
            searchDeviceList: [],
            activeDeviceIndex: 0,
            searchOption: 'productionNumber',
            pagination: {
                count: '',
                next: '',
                previous: ''
            },
            paginationButton: "",
            showPaginationButton: true,
            // showNext: true,
            // showPrevious: true
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

        let accessToken = this.props.access;
        let { productionNumber, registeredDate } = this.state;

        var { searchOption } = this.state;

        let data;

        if (searchOption === 'productionNumber') {
            data = {search: productionNumber}
        }
        else if (searchOption === 'registeredDate') {
            data = {registered: registeredDate}
        }

        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                if (resp.results.length > 0) {
                    this.setState({ ...this.state, searchDeviceList: resp.results, pagination: { next: resp.next, previous: resp.previous } });
                } else {
                    swal({
                        title:"No such device found.",
                        icon:"warning"
                    })
                }
            },
            error: function (resp) {
                console.log(resp)
                swal({
                    text: resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.",
                    icon: "error"
                });
            }
        });

    }


    getHardwareRegisteredByMe = (e) => {
        e.preventDefault();

        this.setState({...this.state, searchOption:"byMyself", searchDeviceList: []})

        let accessToken = this.props.access;

        let data;
        
        data = { by: this.props.userID}


        $.ajax({
            method: "GET",
            url: BASE_URL + "/api/hardware/",
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                if (resp.results.length > 0) {
                    this.setState({ ...this.state, searchDeviceList: resp.results, pagination: { count: resp.count, next: resp.next, previous: resp.previous } });
                } else {
                    swal({
                        title:"No such device found.",
                        icon:"warning"
                    })
                }
            },
            error: function (resp) {
                console.log(resp)
                swal({
                    text: resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.",
                    icon: "error"
                });
            }
        });
    }

    getPagination = (e) => {
        // e.preventDefault();

        let accessToken = this.props.access;

        let {pagination, paginationButton} = this.state;

        let newUrl;

        if ( pagination.next === null && paginationButton === "next" ) {
            // this.setState({...this.state, showNext: !this.state.showNext})
            swal({
                title: "This is the last page",
                icon: "warning"
            })
        }else if ( pagination.previous === null && paginationButton === "previous" ) {
            // this.setState({...this.state, showPrevious: !this.state.showP})
            swal({
                title: "This is the first page",
                icon: "warning"
            })
        } else if ( pagination.next !== null ) {
            newUrl = pagination.next
        } else if ( pagination.previous !== null ) {
            newUrl = pagination.previous
        } 


        $.ajax({
            method: "GET",
            url: newUrl,
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            success: (resp) => {
                if (resp.results.length > 0) {
                    this.setState({ ...this.state, searchDeviceList: resp.results, pagination: { count: resp.count, next: resp.next, previous: resp.previous } });
                } else {
                    swal({
                        title:"No such device found.",
                        icon:"warning"
                    })
                }
            },
            error: function (resp) {
                console.log(resp)
                swal({
                    text: resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.",
                    icon: "error"
                });
            }
        });

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


    showEditModal = () => {
        let { searchDeviceList, activeDeviceIndex } = this.state;

        let proceed = searchDeviceList[activeDeviceIndex].registered_by.id === this.props.userID;

        if (proceed) {
            this.setState({...this.state, editModalShow: true, activeDeviceIndex});
        } else {
            swal({
                title:"Unauthorized",
                text:"You cannot edit hardware registered by other registrars!",
                icon:"warning"
            });
        }
    }

    updateHardwareInfo = () => {
        let accessToken = this.props.access;

        let { searchDeviceList, activeDeviceIndex } = this.state;

        let productionNumber = searchDeviceList[activeDeviceIndex].production_number;
        let device_id = searchDeviceList[activeDeviceIndex].device_id;

        if (productionNumber) {
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
                    let icon;

                    if (resp.status) {
                        icon = "success";
                    } else {
                        icon = "warning";
                    }

                    swal({
                        title: resp.message,
                        icon
                    })
                    // .then(() => this.setState({ ...this.state, productionNumber: ''}));
                },
                error: (resp) => {
                    console.log(resp);
                    swal({
                        text: resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.",
                        icon: "error"
                    })
                    // <Card.Img src={searching} style={{ height: '289px', width: '400px' }} />
                }
            });
        } else {
            swal({
                title: "Please Enter New Production Number.",
                icon: "warning"
            })
            // .then(() => this.setState({ ...this.state, searchDeviceList: [], productionNumber: ''}));
        }
    }

    deleteHardware = (e) => {
        e.preventDefault();
        
        let accessToken = this.props.access;
        let { searchDeviceList, activeDeviceIndex } = this.state;
        let device_id = searchDeviceList[activeDeviceIndex].device_id;
        let proceed = searchDeviceList[activeDeviceIndex].registered_by.id === this.props.userID;

        if (proceed) {
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
                            let icon;
                            // var component = this;

                            if (resp.status) {
                                icon = "success";
                            } else {
                                icon = "warning";
                            }
                            swal({
                                title: resp.message,
                                icon
                            })
                            .then(() => {
                                if (icon === "success") {
                                    let index = this.getDeviceIndexFromState(device_id);
                                    let { searchDeviceList } = this.state;

                                    searchDeviceList.splice(index, 1);
                                    this.setState({ ...this.state, searchDeviceList});
                                }
                            });
                        },
                        error: (resp) => {
                            console.log(resp);
                            swal({
                                title: resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.",
                                icon: "error"
                            })
                        }
                    });
                }
            })
        }
        else {
            swal({
                title: "Unauthorized",
                text: "You cannot delete hardware registered by other registrar.",
                icon: "warning"
            })
        }
    }

    
    

    getImageOrTable = () => {
        let { searchDeviceList, searchOption } = this.state;

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
                                <Button variant="primary" onClick={ () => { this.setState({ ...this.state, activeDeviceIndex: 0}, () => this.showEditModal()) }}> Edit</Button>
                                <Button variant="danger" style={{ marginLeft: '5px' }} onClick={this.deleteHardware}>Delete</Button>
                                
                            </ButtonToolbar>
                        </div>
                    </React.Fragment>
                )
            }
            else  {
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
                                        <td> <Button variant="outline-primary" onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, moreInfoModalShow: true}))}> More </Button></td>
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
                                                    <Button variant="primary" onClick={() => this.showEditModal() } type="submit">Edit</Button>
                                                    <Button variant="danger" style={{ marginLeft: '5px' }} onClick={this.deleteHardware}>Delete</Button>
                                                    <Button variant="outline-danger" onClick={() => this.setState({...this.state, moreInfoModalShow: false })}>Close</Button>
                                                </Modal.Footer>
                                            </Card>
                                        </Modal>
                                    </tr>    
                                ))}
                            </tbody>
                        </Table>
                        {this.state.pagination.count > 10?
                            // <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            //     <Button variant="secondary" onClick={ () => this.setState({...this.state, paginationButton: "previous"}, () => {this.getPagination()} )}>Previous</Button>
                            //     <Button variant="secondary" style={{marginLeft: '10px'}}  onClick={ () => this.setState({...this.state, paginationButton: "next"}, () => {this.getPagination()} )}>Next</Button>
                            // </div>
                            <div>
                                <Row>
                                    <Col md={4}>
                                        <Button variant="secondary" onClick={ () => this.setState({...this.state, paginationButton: "previous"}, () => {this.getPagination()} )} size="sm">Previous</Button>
                                    </Col>
                                    <Col md={4}>
                                        <div className="text-center">
                                            Page 1 of 1
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant="secondary" onClick={ () => this.setState({...this.state, paginationButton: "next"}, () => {this.getPagination()} )} size="sm" style={{float:'right'}}>Next</Button>
                                    </Col>
                                </Row>
                            </div>
                        : null
                        }
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
        } else if ( searchOption === "byMyself" ) {
            return (
                <React.Fragment>
                    <Form.Control
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="text"
                        value={this.props.username}
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
                    <span onClick={() => { this.setState({ searchDeviceList: [], productionNumber: "", registeredDate: "", searchOption: "productionNumber"}) }}><h3 style={{ textAlign: 'center' }}> Search Hardware </h3></span>
                    <br />
                    <Form onSubmit={this.getHardware}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <Dropdown>
                                    <Dropdown.Toggle className="prepend-dropdown" variant="outline-primary" id="dropdown-basic">
                                        Search By
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={ () => this.setState({...this.state, searchOption:"productionNumber", searchDeviceList:[], productionNumber: ""}) }>Production Number</Dropdown.Item>
                                        <Dropdown.Item onClick={ () => this.setState({...this.state, searchOption:"registeredDate", searchDeviceList:[], registeredDate: ""}) }>Registered Date</Dropdown.Item>
                                        <Dropdown.Item onClick={ this.getHardwareRegisteredByMe }>Myself</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup.Prepend>
                            { this.getSearchField() }
                            <InputGroup.Append>
                                <Button variant="primary" type="submit">Search</Button>
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
                            <Button variant="success" onClick={() => this.updateHardwareInfo()}>Save Changes</Button>
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
