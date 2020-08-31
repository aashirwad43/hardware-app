import React, { Component } from 'react'
import { Button, InputGroup, Row, Col, Form, Card, Table, Modal, FormControl, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import $ from 'jquery';

import { BASE_URL } from '../baseValues';
// import searching from "../assets/images/searching.png";
import searching from "../assets/images/search.svg";
import loading from '../assets/images/loading.gif';


const cardStyle = {
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px #000',
    width: '270rem',
    // height: '35rem'
};


const buttonStyle = {

    display: 'flex',
    justifyContent: 'center'

};

const deleteStyle = {
    color: 'red',
    cursor: 'pointer'
};

const editStyle = {
    color: '#07adfa',
    marginLeft: '10px',
    cursor: 'pointer'
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
            xhr: function () {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function () {
                    swal({
                        icon:loading,
                        buttons: false
                    });
                }, false);

                return xhr;
            },
            data,
            dataType: 'json',
            success: (resp) => {
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
                xhr: function () {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function () {
                        swal({
                            icon:loading,
                            buttons:false
                        });
                    }, false);

                    return xhr;
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
        // e.preventDefault();
        
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
                        xhr: function () {
                            let xhr = new window.XMLHttpRequest();
                            xhr.upload.addEventListener("progress", function () {
                                swal({
                                    icon:loading,
                                    buttons: false
                                });
                            }, false);
        
                            return xhr;
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
                                    this.props.updateHardwareInfo();
                                    
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
                    <div className="text-center">
                        <img alt="search" src={searching} style={{width: '40%'}} />
                    </div>
                    {/* <div className="container">
                        <img alt="search" src={searching} style={{width: '100%'}} />
                    </div> */}
                </React.Fragment>
            )
        } else {
            if (searchOption === "productionNumber"){
                return (
                    <React.Fragment>
                        <Table responsive style={{textAlign: 'center'}}>
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
                            <i class="fas fa-edit fa-lg" style={{color: '#07adfa', cursor: 'pointer'}} onClick={ () => { this.setState({ ...this.state, activeDeviceIndex: 0}, () => this.showEditModal()) }}></i>
                            <i class="fas fa-trash fa-lg" style={{ color: 'red', marginLeft: '20px', cursor: 'pointer' }} onClick={this.deleteHardware}></i>
                        </div>
                    </React.Fragment>
                )
            }
            else  {
                return(
                    <React.Fragment>
                        <div style={{overflowY:'scroll', height: '25rem'}}>
                            <Table responsive style={{textAlign: 'center'}}>
                                <tbody>
                                    <tr>
                                        <th>Device ID</th>
                                        <th>Production Number</th>
                                        <th>Registered By</th>
                                        <th>Registered Date</th>
                                        <th></th>
                                    </tr>
                                    {searchDeviceList.map(device => (
                                        <tr key={device.device_id}>
                                            <td>{device.device_id}</td>
                                            <td>{device.production_number}</td>
                                            <td>{device.registered_by.username}</td>
                                            <td>{device.registered_on}</td>
                                            <td> 
                                                {/* <Button variant="outline-primary" size="sm" onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, moreInfoModalShow: true}))}> More</Button>  */}
                                                <i className="fas fa-trash" style={deleteStyle}  onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)} , () => {this.deleteHardware()})}></i>
                                                {/* <Button style={{ marginLeft: '5px' }} onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)} , () => {this.deleteHardware()})}></Button> */}
                                                <i class="fas fa-edit" style={editStyle} onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, editModalShow: true}))} ></i>
                                                {/* <Button variant="outline-primary" style={{margin: '5px'}} onClick={() => this.setState({...this.state, activeDeviceIndex: this.getDeviceIndexFromState(device.device_id)},() => this.setState({...this.state, editModalShow: true}))}> Edit </Button> */}
                                            </td>
                                        </tr>    
                                    ))}
                                </tbody>
                            </Table>
                        </div>
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
                    <Card.Body>
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
                        <hr />
                        {this.getImageOrTable()}
                    </Card.Body>
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
