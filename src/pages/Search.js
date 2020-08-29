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
    width: '300rem',
    height: '35rem'
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
                previous: '',
                totalPage: '',
                activePage: 1
            },
        }
    }

    updateProductNumber = (e) => {
        this.setState({ ...this.state, productionNumber: e.target.value })
    }

    updateRegisteredDate = (e) => {
        this.setState({ ...this.state, registeredDate: e.target.value })
    }

    getHardware = (paginate = null) => {

        let accessToken = this.props.access;
        let { productionNumber, registeredDate, pagination, searchOption } = this.state;

        let data = null;
        let url = BASE_URL + "/api/hardware/";

        if (paginate === "next") {
            url = pagination.next;
        } else if (paginate === "prev") {
            url = pagination.previous;
        } else if (searchOption === 'productionNumber') {
            data = { search: productionNumber }
        } else if (searchOption === 'registeredDate') {
            data = { registered: registeredDate }
        } else if (searchOption === 'byMyself') {
            data = { by: this.props.user.id }
        }

        $.ajax({
            method: "GET",
            url,
            headers: {
                Authorization: accessToken,
                'Content-Type': 'application/json'
            },
            data,
            dataType: 'json',
            success: (resp) => {
                console.log(resp)
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
                            pagination.activePage = parseInt(resp.next[resp.next.length - 1]) - 1;
                        } else if (resp.previous) {
                            if (resp.previous.indexOf('page=') === -1) {
                                pagination.activePage = 2;
                            } else {
                                let previousPage = parseInt(resp.previous[resp.previous.length - 1]);
        
                                pagination.activePage = previousPage + 1;
                            }
                        }
                    }

                    
                    this.setState({ ...this.state, searchDeviceList: resp.results, pagination});
                } else {
                    swal({
                        title:"No device found.",
                        icon:"warning"
                    })
                }
            },
            error: function (resp) {
                console.log(resp);
                let text;

                try {
                    text = resp.responseJSON.message ? resp.responseJSON.message : "Something went wrong.";
                } catch (e) {
                    console.log(e);
                    text = "Something went wrong.";
                }

                swal({
                    text,
                    icon: "error"
                });
            }
        });

    }


    getHardwareRegisteredByMe = () => {
        this.setState({...this.state, searchOption:"byMyself", searchDeviceList: []}, () => this.getHardware());
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
        searchDeviceList[this.state.activeDeviceIndex].production_number = e.target.value;
        this.setState({ ...this.state, searchDeviceList });
    }


    showEditModal = () => {
        let { searchDeviceList, activeDeviceIndex } = this.state;

        let proceed = searchDeviceList[activeDeviceIndex].registered_by.id === this.props.user.id;

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
        let proceed = searchDeviceList[activeDeviceIndex].registered_by.id === this.props.user.id;

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
                    <div style={{display: 'flex', justifyContent: 'center'}} >
                        <Card.Img src={searching} style={{width: '50%'}} />
                    </div>
                </React.Fragment>
            )
        } else {
            if (searchOption === "productionNumber"){
                return (
                    <React.Fragment>
                        <Row>
                            <Col sm={3}>
                                <Form.Label>Device ID</Form.Label>
                            </Col>
                            <Col sm={9}>
                                <p className="form-control"><small>{searchDeviceList[0].device_id}</small></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5}>
                                <Form.Label>Production Number</Form.Label>
                            </Col>
                            <Col sm={7}>
                                <p className="form-control">{searchDeviceList[0].production_number}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Registered By</Form.Label>
                                <p className="form-control">{searchDeviceList[0].registered_by.username}</p>
                            </Col>
                            <Col>
                                <Form.Label>Registered On</Form.Label>
                                <p className="form-control"><small>{searchDeviceList[0].registered_on}</small></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Updated By</Form.Label>
                                <p className="form-control">{searchDeviceList[0].updated_by.username}</p>
                            </Col>
                            <Col>
                                <Form.Label>Updated On</Form.Label>
                                <p className="form-control"><small>{searchDeviceList[0].updated_on}</small></p>
                            </Col>
                        </Row>
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
                        <div style={{overflowY:'scroll', height: '25rem'}}>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <th>Device ID</th>
                                        <th>Production Number</th>
                                        <th>Registered By</th>
                                        <th>Registered Date</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                    {searchDeviceList.map(device => (
                                        <tr key={device.device_id}>
                                            <td>{device.device_id}</td>
                                            <td>{device.production_number}</td>
                                            <td>{device.registered_by.username}</td>
                                            <td>{device.registered_on}</td>
                                            <td> <Button variant="outline-primary" size="sm" onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, moreInfoModalShow: true}))}> More </Button></td>
                                            <td> <Button variant="outline-primary" size="sm" onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, editModalShow: true}))}> Edit </Button></td>
                                        </tr>    
                                    ))}
                                </tbody>
                            </Table>
                            <Modal
                            // aria-labelledby="contained-modal-title-vcenter"
                            centered
                            show={this.state.moreInfoModalShow}
                            onHide={() => this.setState({...this.state, activeDeviceIndex:0 , moreInfoModalShow: false })}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Hardware Details
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col sm={3}>
                                            <Form.Label>Device ID</Form.Label>
                                        </Col>
                                        <Col sm={9}>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].device_id}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={5}>
                                            <Form.Label>Production Number</Form.Label>
                                        </Col>
                                        <Col sm={7}>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].production_number}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Registered By</Form.Label>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].registered_by.username}</p>
                                        </Col>
                                        <Col>
                                            <Form.Label>Registered On</Form.Label>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].registered_on}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Updated By</Form.Label>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].updated_by.username}</p>
                                        </Col>
                                        <Col>
                                            <Form.Label>Updated On</Form.Label>
                                            <p className="form-control">{this.state.searchDeviceList[this.state.activeDeviceIndex].updated_on}</p>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.showEditModal() } type="submit">Edit</Button>
                                    <Button variant="danger" style={{ marginLeft: '5px' }} onClick={this.deleteHardware}>Delete</Button>
                                    {/* <Button variant="outline-danger" onClick={() => this.setState({...this.state, activeDeviceIndex:0, moreInfoModalShow: false })}>Close</Button> */}
                                </Modal.Footer>
                            </Modal>
                        </div>
                        {/* {this.state.pagination.count > 10?
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button variant="secondary" onClick={ () => this.setState({...this.state, paginationButton: "previous"}, () => {this.getPagination()} )}>Previous</Button>
                                <Button variant="secondary" style={{marginLeft: '10px'}}  onClick={ () => this.setState({...this.state, paginationButton: "next"}, () => {this.getPagination()} )}>Next</Button>
                            </div>
                            : null
                        } */}
                        <div style={{marginTop:'1rem'}}>
                            <Row>
                                <Col sm={4}>
                                    <Button variant="secondary" 
                                    onClick={ () => this.getHardware("prev") } size="sm"
                                    disabled={ this.state.pagination.previous ? false : true }>Previous</Button>
                                </Col>
                                <Col sm={4}>
                                    <div className="text-center">
                                        Page { this.state.pagination.activePage } of { this.state.pagination.totalPage }
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <Button variant="secondary" 
                                    onClick={ () => this.getHardware("next") } size="sm" style={{float:'right'}}
                                    disabled={ this.state.pagination.next ? false : true }>Next</Button>
                                </Col>
                            </Row>
                        </div>
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
                        value={this.props.user.username}
                        disabled
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
                    <Form onSubmit={(e) => e.preventDefault()}>
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
                                <Button variant="primary" type="button" onClick={this.getHardware}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    {this.getImageOrTable()}
                </Card>
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.editModalShow}
                    onHide={() => this.setState({...this.state, editModalShow: false })}
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
                            {/* <Button variant="danger" onClick={() => this.setState({...this.state, editModalShow: false })}>Close</Button> */}
                            <Button variant="success" onClick={() => this.updateHardwareInfo()}>Save Changes</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => ({
    access: state.credentials.tokens.accessToken,
    user: state.credentials.user,
})

export default connect(mapStateToProps, {})(Search);
